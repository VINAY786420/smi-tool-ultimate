import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

const USER_AGENT = process.env.REDDIT_USER_AGENT || 'smi-tool-ultimate/1.0';

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    author: string;
    permalink: string;
    ups: number;
    num_comments: number;
    score: number;
    created_utc: number;
  };
}

function hasApiCreds(): boolean {
  return Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
}

// ---- REAL MODE: authenticated OAuth call to oauth.reddit.com (higher rate limit, full data) ----
async function fetchViaOAuth(keyword: string): Promise<RedditPost[]> {
  const clientId = process.env.REDDIT_CLIENT_ID!;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET!;

  const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenRes.ok) {
    throw new Error(`Reddit OAuth token request failed: ${tokenRes.status} ${await tokenRes.text()}`);
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const searchRes = await fetch(
    `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&sort=new&limit=25`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': USER_AGENT,
      },
    }
  );

  if (!searchRes.ok) {
    throw new Error(`Reddit search API failed: ${searchRes.status}`);
  }

  const json = (await searchRes.json()) as { data: { children: RedditPost[] } };
  return json.data.children;
}

// ---- FALLBACK MODE: Reddit's public, no-auth JSON endpoint (same data, lower rate limit) ----
async function fetchViaPublicJson(keyword: string): Promise<RedditPost[]> {
  const res = await fetch(
    `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=25`,
    { headers: { 'User-Agent': USER_AGENT } }
  );

  if (!res.ok) {
    throw new Error(`Reddit public JSON endpoint failed: ${res.status}`);
  }

  const json = (await res.json()) as { data: { children: RedditPost[] } };
  return json.data.children;
}

function toRow(post: RedditPost, keyword: string, mode: 'api' | 'public'): CollectedDataInsert {
  const p = post.data;
  return {
    platform: 'Reddit',
    platform_type: 'Social',
    data_type: 'post',
    keyword,
    title: p.title,
    content: p.selftext?.slice(0, 2000) || null,
    author: p.author,
    url: `https://reddit.com${p.permalink}`,
    likes: p.ups ?? p.score ?? 0,
    comments: p.num_comments ?? 0,
    shares: null,
    views: null,
    price: null,
    rating: null,
    sentiment: null, // left for a separate analytics/enrichment step
    sentiment_score: null,
    emotion: null,
    emotion_score: null,
    language: null,
    entities: [],
    topics: [],
    virality_score: null,
    bot_score: null,
    source: mode,
  };
}

export async function collectReddit(keyword: string): Promise<CollectorResult> {
  const useApi = hasApiCreds();

  try {
    const posts = useApi ? await fetchViaOAuth(keyword) : await fetchViaPublicJson(keyword);
    return {
      platform: 'Reddit',
      mode: useApi ? 'api' : 'public',
      rows: posts.map((p) => toRow(p, keyword, useApi ? 'api' : 'public')),
    };
  } catch (err) {
    // If authenticated call fails for some reason, still try the public endpoint once
    // rather than returning nothing.
    if (useApi) {
      console.warn(`[reddit] OAuth mode failed (${(err as Error).message}), falling back to public JSON`);
      const posts = await fetchViaPublicJson(keyword);
      return { platform: 'Reddit', mode: 'public', rows: posts.map((p) => toRow(p, keyword, 'public')) };
    }
    throw err;
  }
}

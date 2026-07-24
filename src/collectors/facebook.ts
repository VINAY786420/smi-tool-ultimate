import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface FbPost {
  id: string;
  message?: string;
  permalink_url?: string;
  created_time?: string;
  likes?: { summary?: { total_count: number } };
  comments?: { summary?: { total_count: number } };
  shares?: { count: number };
}

// Facebook removed public keyword search of posts across the platform back in 2015.
// The Graph API today only lets you read content from Pages you manage. This collector
// fetches your own Page's recent posts and filters them by keyword client-side -
// it cannot search Facebook at large.
async function fetchOwnPage(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;
  const pageId = process.env.FACEBOOK_PAGE_ID!;

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/posts?fields=message,permalink_url,created_time,likes.summary(true),comments.summary(true),shares&access_token=${token}`
  );
  if (!res.ok) {
    throw new Error(`Facebook Graph API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data: FbPost[] };
  const lowerKeyword = keyword.toLowerCase();

  return (json.data || [])
    .filter((p) => (p.message || '').toLowerCase().includes(lowerKeyword))
    .map((p) => ({
      platform: 'Facebook',
      platform_type: 'Social' as const,
      data_type: 'post',
      keyword,
      title: null,
      content: p.message?.slice(0, 2000) || null,
      author: null,
      url: p.permalink_url || null,
      likes: p.likes?.summary?.total_count ?? null,
      comments: p.comments?.summary?.total_count ?? null,
      shares: p.shares?.count ?? null,
      views: null,
      price: null,
      rating: null,
      sentiment: null,
      sentiment_score: null,
      emotion: null,
      emotion_score: null,
      language: null,
      entities: [],
      topics: [],
      virality_score: null,
      bot_score: null,
      source: 'api' as const,
    }));
}

export async function collectFacebook(keyword: string): Promise<CollectorResult> {
  if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN || !process.env.FACEBOOK_PAGE_ID) {
    return {
      platform: 'Facebook',
      mode: 'unavailable',
      rows: [],
      note:
        'FACEBOOK_PAGE_ACCESS_TOKEN / FACEBOOK_PAGE_ID not set. Facebook removed public post ' +
        'search in 2015 - the Graph API only exposes content from Pages you manage, filtered ' +
        'by keyword locally. No broader public search exists.',
    };
  }
  return { platform: 'Facebook', mode: 'api', rows: await fetchOwnPage(keyword) };
}

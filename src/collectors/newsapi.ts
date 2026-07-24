import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';
import { fetchGoogleNewsRss } from '../lib/googleNewsRss.js';

interface NewsApiArticle {
  title: string;
  description: string | null;
  author: string | null;
  url: string;
  source: { name: string };
  publishedAt: string;
}

async function fetchViaNewsApi(keyword: string): Promise<CollectedDataInsert[]> {
  const key = process.env.NEWSAPI_KEY!;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    keyword
  )}&sortBy=publishedAt&pageSize=25&apiKey=${key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NewsAPI request failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as { articles: NewsApiArticle[] };

  return json.articles.map((a) => ({
    platform: 'NewsAPI',
    platform_type: 'News' as const,
    data_type: 'article',
    keyword,
    title: a.title || null,
    content: a.description?.slice(0, 2000) || null,
    author: a.author || a.source?.name || null,
    url: a.url || null,
    likes: null,
    comments: null,
    shares: null,
    views: null,
    price: null,
    rating: null,
    sentiment: null,
    sentiment_score: null,
    emotion: null,
    emotion_score: null,
    language: 'en',
    entities: [],
    topics: [],
    virality_score: null,
    bot_score: null,
    source: 'api' as const,
  }));
}

export async function collectNewsApi(keyword: string): Promise<CollectorResult> {
  const hasKey = Boolean(process.env.NEWSAPI_KEY);

  if (hasKey) {
    try {
      const rows = await fetchViaNewsApi(keyword);
      return { platform: 'NewsAPI', mode: 'api', rows };
    } catch (err) {
      console.warn(`[newsapi] key present but request failed (${(err as Error).message}), falling back to Google News RSS`);
    }
  }

  // No key (or key failed) - Google News RSS is a legitimate public substitute for real news data.
  const rows = await fetchGoogleNewsRss(keyword);
  return {
    platform: 'NewsAPI',
    mode: 'public',
    rows: rows.map((r) => ({ ...r, platform: 'NewsAPI' })),
    note: hasKey ? undefined : 'NEWSAPI_KEY not set - using Google News RSS as a real-data substitute.',
  };
}

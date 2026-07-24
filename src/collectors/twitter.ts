import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface TweetItem {
  id: string;
  text: string;
  author_id: string;
  public_metrics: { like_count: number; retweet_count: number; reply_count: number; impression_count?: number };
  created_at: string;
}

async function fetchViaApi(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.TWITTER_BEARER_TOKEN!;
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
    keyword
  )}&max_results=25&tweet.fields=public_metrics,created_at,author_id`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    throw new Error(`Twitter API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: TweetItem[] };

  return (json.data || []).map((t) => ({
    platform: 'Twitter/X',
    platform_type: 'Social' as const,
    data_type: 'post',
    keyword,
    title: null,
    content: t.text?.slice(0, 2000) || null,
    author: t.author_id,
    url: `https://twitter.com/i/web/status/${t.id}`,
    likes: t.public_metrics?.like_count ?? null,
    comments: t.public_metrics?.reply_count ?? null,
    shares: t.public_metrics?.retweet_count ?? null,
    views: t.public_metrics?.impression_count ?? null,
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

export async function collectTwitter(keyword: string): Promise<CollectorResult> {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    return {
      platform: 'Twitter/X',
      mode: 'unavailable',
      rows: [],
      note:
        'TWITTER_BEARER_TOKEN not set. X/Twitter has no free public search API anymore - ' +
        'a paid API tier (developer.x.com) is required. No legitimate fallback exists.',
    };
  }
  return { platform: 'Twitter/X', mode: 'api', rows: await fetchViaApi(keyword) };
}

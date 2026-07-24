import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface ThreadsPost {
  id: string;
  text?: string;
  permalink?: string;
  timestamp?: string;
}

// Meta's Threads API (launched 2024) only exposes the authorized user's own threads.
// There is no keyword search across the platform.
async function fetchOwnThreads(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.THREADS_ACCESS_TOKEN!;
  const userId = process.env.THREADS_USER_ID!;

  const res = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads?fields=id,text,permalink,timestamp&access_token=${token}`
  );
  if (!res.ok) {
    throw new Error(`Threads API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data: ThreadsPost[] };
  const lowerKeyword = keyword.toLowerCase();

  return (json.data || [])
    .filter((p) => (p.text || '').toLowerCase().includes(lowerKeyword))
    .map((p) => ({
      platform: 'Threads',
      platform_type: 'Social' as const,
      data_type: 'post',
      keyword,
      title: null,
      content: p.text?.slice(0, 2000) || null,
      author: null,
      url: p.permalink || null,
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
      language: null,
      entities: [],
      topics: [],
      virality_score: null,
      bot_score: null,
      source: 'api' as const,
    }));
}

export async function collectThreads(keyword: string): Promise<CollectorResult> {
  if (!process.env.THREADS_ACCESS_TOKEN || !process.env.THREADS_USER_ID) {
    return {
      platform: 'Threads',
      mode: 'unavailable',
      rows: [],
      note:
        'THREADS_ACCESS_TOKEN / THREADS_USER_ID not set. The Threads API only exposes your ' +
        "own account's posts, filtered by keyword locally - there is no public search.",
    };
  }
  return { platform: 'Threads', mode: 'api', rows: await fetchOwnThreads(keyword) };
}

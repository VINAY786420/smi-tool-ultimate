import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface PinterestPin {
  id: string;
  title?: string;
  description?: string;
  link?: string;
}

// Pinterest API v5 lets an authenticated app read its own pins/boards. Searching
// public pins across Pinterest requires a content-partnership Pinterest does not
// grant through self-serve signup.
async function fetchOwnPins(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.PINTEREST_ACCESS_TOKEN!;

  const res = await fetch('https://api.pinterest.com/v5/pins?page_size=25', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Pinterest API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { items: PinterestPin[] };
  const lowerKeyword = keyword.toLowerCase();

  return (json.items || [])
    .filter((p) => `${p.title || ''} ${p.description || ''}`.toLowerCase().includes(lowerKeyword))
    .map((p) => ({
      platform: 'Pinterest',
      platform_type: 'Social' as const,
      data_type: 'pin',
      keyword,
      title: p.title || null,
      content: p.description?.slice(0, 2000) || null,
      author: null,
      url: p.link || null,
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

export async function collectPinterest(keyword: string): Promise<CollectorResult> {
  if (!process.env.PINTEREST_ACCESS_TOKEN) {
    return {
      platform: 'Pinterest',
      mode: 'unavailable',
      rows: [],
      note:
        'PINTEREST_ACCESS_TOKEN not set. Public pin search needs a Pinterest content ' +
        "partnership - self-serve apps can only read their own account's pins, filtered " +
        'by keyword locally.',
    };
  }
  return { platform: 'Pinterest', mode: 'api', rows: await fetchOwnPins(keyword) };
}

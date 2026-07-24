import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface TiktokVideo {
  id: string;
  video_description?: string;
  share_url?: string;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  view_count?: number;
  create_time?: number;
}

// TikTok's Display API only returns videos from the account that authorized your app -
// there is no public endpoint to search all of TikTok by keyword without Research API
// approval (which is restricted to qualifying academic/non-profit researchers).
async function fetchOwnAccountVideos(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.TIKTOK_ACCESS_TOKEN!;

  const res = await fetch(
    'https://open.tiktokapis.com/v2/video/list/?fields=id,video_description,share_url,like_count,comment_count,share_count,view_count,create_time',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ max_count: 20 }),
    }
  );
  if (!res.ok) {
    throw new Error(`TikTok API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data: { videos: TiktokVideo[] } };
  const lowerKeyword = keyword.toLowerCase();

  return (json.data?.videos || [])
    .filter((v) => (v.video_description || '').toLowerCase().includes(lowerKeyword))
    .map((v) => ({
      platform: 'TikTok',
      platform_type: 'Social' as const,
      data_type: 'video',
      keyword,
      title: null,
      content: v.video_description?.slice(0, 2000) || null,
      author: null,
      url: v.share_url || null,
      likes: v.like_count ?? null,
      comments: v.comment_count ?? null,
      shares: v.share_count ?? null,
      views: v.view_count ?? null,
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

export async function collectTiktok(keyword: string): Promise<CollectorResult> {
  if (!process.env.TIKTOK_ACCESS_TOKEN) {
    return {
      platform: 'TikTok',
      mode: 'unavailable',
      rows: [],
      note:
        'TIKTOK_ACCESS_TOKEN not set. TikTok has no public keyword-search API without ' +
        'restricted Research API approval - the open Display API only reads your own ' +
        "connected account's videos, filtered by keyword locally.",
    };
  }
  return { platform: 'TikTok', mode: 'api', rows: await fetchOwnAccountVideos(keyword) };
}

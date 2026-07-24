import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface YoutubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
  };
}

interface YoutubeVideoStats {
  id: string;
  statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
}

async function fetchViaApi(keyword: string): Promise<CollectedDataInsert[]> {
  const key = process.env.YOUTUBE_API_KEY!;

  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&maxResults=25&q=${encodeURIComponent(
      keyword
    )}&key=${key}`
  );
  if (!searchRes.ok) {
    throw new Error(`YouTube search API failed: ${searchRes.status} ${await searchRes.text()}`);
  }
  const searchJson = (await searchRes.json()) as { items: YoutubeSearchItem[] };
  const items = searchJson.items || [];
  if (items.length === 0) return [];

  const ids = items.map((i) => i.id.videoId).join(',');
  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${key}`
  );
  const statsJson = statsRes.ok ? ((await statsRes.json()) as { items: YoutubeVideoStats[] }) : { items: [] };
  const statsById = new Map(statsJson.items.map((s) => [s.id, s.statistics]));

  return items.map((item) => {
    const stats = statsById.get(item.id.videoId) || {};
    return {
      platform: 'YouTube',
      platform_type: 'Social' as const,
      data_type: 'video',
      keyword,
      title: item.snippet.title || null,
      content: item.snippet.description?.slice(0, 2000) || null,
      author: item.snippet.channelTitle || null,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      likes: stats.likeCount ? Number(stats.likeCount) : null,
      comments: stats.commentCount ? Number(stats.commentCount) : null,
      shares: null,
      views: stats.viewCount ? Number(stats.viewCount) : null,
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
    };
  });
}

export async function collectYoutube(keyword: string): Promise<CollectorResult> {
  const hasKey = Boolean(process.env.YOUTUBE_API_KEY);

  if (!hasKey) {
    return {
      platform: 'YouTube',
      mode: 'unavailable',
      rows: [],
      note:
        'YOUTUBE_API_KEY not set. YouTube has no public keyless search API, so this collector ' +
        'is skipped (not faked) until a key is added. Get a free key at console.cloud.google.com (enable "YouTube Data API v3").',
    };
  }

  const rows = await fetchViaApi(keyword);
  return { platform: 'YouTube', mode: 'api', rows };
}

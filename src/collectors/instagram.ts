import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface IgMedia {
  id: string;
  caption?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
  media_type?: string;
  timestamp?: string;
}

// Instagram Graph API only supports keyword lookup via *hashtags*, and only through
// a Business/Creator account linked to a Facebook Page. There is no keyword-across-
// captions search and no public no-auth alternative.
async function fetchViaApi(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN!;
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!;
  const hashtag = keyword.replace(/^#/, '').replace(/\s+/g, '');

  const hashtagSearchRes = await fetch(
    `https://graph.facebook.com/v19.0/ig_hashtag_search?user_id=${igUserId}&q=${encodeURIComponent(
      hashtag
    )}&access_token=${token}`
  );
  if (!hashtagSearchRes.ok) {
    throw new Error(`Instagram hashtag lookup failed: ${hashtagSearchRes.status} ${await hashtagSearchRes.text()}`);
  }
  const hashtagJson = (await hashtagSearchRes.json()) as { data: { id: string }[] };
  const hashtagId = hashtagJson.data?.[0]?.id;
  if (!hashtagId) return [];

  const mediaRes = await fetch(
    `https://graph.facebook.com/v19.0/${hashtagId}/recent_media?user_id=${igUserId}` +
      `&fields=id,caption,permalink,like_count,comments_count,media_type,timestamp&access_token=${token}`
  );
  if (!mediaRes.ok) {
    throw new Error(`Instagram hashtag media fetch failed: ${mediaRes.status}`);
  }
  const mediaJson = (await mediaRes.json()) as { data: IgMedia[] };

  return (mediaJson.data || []).map((m) => ({
    platform: 'Instagram',
    platform_type: 'Social' as const,
    data_type: 'post',
    keyword,
    title: null,
    content: m.caption?.slice(0, 2000) || null,
    author: null,
    url: m.permalink || null,
    likes: m.like_count ?? null,
    comments: m.comments_count ?? null,
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

export async function collectInstagram(keyword: string): Promise<CollectorResult> {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    return {
      platform: 'Instagram',
      mode: 'unavailable',
      rows: [],
      note:
        'INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID not set. Instagram only allows ' +
        'hashtag lookup (not free-text keyword search) and only via a Business account connected ' +
        'to a Facebook Page. Set up at developers.facebook.com. No public fallback exists.',
    };
  }
  return { platform: 'Instagram', mode: 'api', rows: await fetchViaApi(keyword) };
}

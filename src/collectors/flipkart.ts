import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface FlipkartProduct {
  productBaseInfoV1: {
    productId: string;
    title: string;
    productUrl: string;
    flipkartSellingPrice?: { amount: number };
    productRating?: string;
  };
}

// Flipkart's Affiliate API doesn't support free-text keyword search - affiliates get
// feed access to fixed categories, refreshed periodically. This fetches a category feed
// and filters client-side by keyword, which is the closest legitimate equivalent.
async function fetchViaApi(keyword: string): Promise<CollectedDataInsert[]> {
  const affiliateId = process.env.FLIPKART_AFFILIATE_ID!;
  const token = process.env.FLIPKART_AFFILIATE_TOKEN!;

  const res = await fetch('https://affiliate-api.flipkart.net/affiliate/1.0/search.json', {
    headers: { 'Fk-Affiliate-Id': affiliateId, 'Fk-Affiliate-Token': token },
  });
  if (!res.ok) {
    throw new Error(`Flipkart Affiliate API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { products: FlipkartProduct[] };
  const lowerKeyword = keyword.toLowerCase();

  return (json.products || [])
    .filter((p) => p.productBaseInfoV1.title.toLowerCase().includes(lowerKeyword))
    .map((p) => ({
      platform: 'Flipkart',
      platform_type: 'Marketplace' as const,
      data_type: 'product',
      keyword,
      title: p.productBaseInfoV1.title || null,
      content: null,
      author: null,
      url: p.productBaseInfoV1.productUrl || null,
      likes: null,
      comments: null,
      shares: null,
      views: null,
      price: p.productBaseInfoV1.flipkartSellingPrice?.amount ?? null,
      rating: p.productBaseInfoV1.productRating ? Number(p.productBaseInfoV1.productRating) : null,
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

export async function collectFlipkart(keyword: string): Promise<CollectorResult> {
  if (!process.env.FLIPKART_AFFILIATE_ID || !process.env.FLIPKART_AFFILIATE_TOKEN) {
    return {
      platform: 'Flipkart',
      mode: 'unavailable',
      rows: [],
      note:
        'FLIPKART_AFFILIATE_ID / FLIPKART_AFFILIATE_TOKEN not set. Requires an approved ' +
        'Flipkart Affiliate account. Even then, it only returns a category feed (filtered ' +
        'locally by keyword), not true full-text search. No public fallback exists.',
    };
  }
  return { platform: 'Flipkart', mode: 'api', rows: await fetchViaApi(keyword) };
}

import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';
import { signPaApiRequest } from '../lib/awsSigV4.js';

interface PaApiItem {
  ASIN: string;
  DetailPageURL?: string;
  ItemInfo?: { Title?: { DisplayValue?: string } };
  Offers?: { Listings?: { Price?: { Amount?: number } }[] };
  CustomerReviews?: { StarRating?: { Value?: number }; Count?: number };
}

async function fetchViaApi(keyword: string): Promise<CollectedDataInsert[]> {
  const accessKey = process.env.AMAZON_PAAPI_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_PAAPI_SECRET_KEY!;
  const partnerTag = process.env.AMAZON_PAAPI_PARTNER_TAG!; // your Associates tracking ID
  const host = process.env.AMAZON_PAAPI_HOST || 'webservices.amazon.in';
  const region = process.env.AMAZON_PAAPI_REGION || 'eu-west-1';

  const { url, headers, body } = signPaApiRequest({
    host,
    region,
    accessKey,
    secretKey,
    target: 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    payload: {
      Keywords: keyword,
      PartnerTag: partnerTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.in',
      Resources: ['ItemInfo.Title', 'Offers.Listings.Price', 'CustomerReviews.StarRating', 'CustomerReviews.Count'],
    },
  });

  const res = await fetch(url, { method: 'POST', headers, body });
  if (!res.ok) {
    throw new Error(`Amazon PA-API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { SearchResult?: { Items?: PaApiItem[] } };

  return (json.SearchResult?.Items || []).map((item) => ({
    platform: 'Amazon India',
    platform_type: 'Marketplace' as const,
    data_type: 'product',
    keyword,
    title: item.ItemInfo?.Title?.DisplayValue || null,
    content: null,
    author: null,
    url: item.DetailPageURL || null,
    likes: null,
    comments: null,
    shares: null,
    views: null,
    price: item.Offers?.Listings?.[0]?.Price?.Amount ?? null,
    rating: item.CustomerReviews?.StarRating?.Value ?? null,
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

export async function collectAmazon(keyword: string): Promise<CollectorResult> {
  const hasCreds =
    process.env.AMAZON_PAAPI_ACCESS_KEY && process.env.AMAZON_PAAPI_SECRET_KEY && process.env.AMAZON_PAAPI_PARTNER_TAG;

  if (!hasCreds) {
    return {
      platform: 'Amazon India',
      mode: 'unavailable',
      rows: [],
      note:
        'AMAZON_PAAPI_ACCESS_KEY / SECRET_KEY / PARTNER_TAG not set. Amazon requires an ' +
        'approved Associates account (which needs qualifying referral sales) to get ' +
        'Product Advertising API credentials. No public fallback exists - Amazon prohibits scraping.',
    };
  }
  return { platform: 'Amazon India', mode: 'api', rows: await fetchViaApi(keyword) };
}

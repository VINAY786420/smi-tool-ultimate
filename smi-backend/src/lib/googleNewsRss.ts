import Parser from 'rss-parser';
import type { CollectedDataInsert } from './types.js';

const parser = new Parser();

// Google News publishes a fully public, no-auth RSS search feed. No key required, ever.
export async function fetchGoogleNewsRss(keyword: string): Promise<CollectedDataInsert[]> {
  const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    keyword
  )}&hl=en-IN&gl=IN&ceid=IN:en`;

  const feed = await parser.parseURL(feedUrl);

  return (feed.items || []).slice(0, 25).map((item) => ({
    platform: 'Google News',
    platform_type: 'News' as const,
    data_type: 'article',
    keyword,
    title: item.title || null,
    content: item.contentSnippet?.slice(0, 2000) || null,
    author: item.creator || (item as { source?: string }).source || null,
    url: item.link || null,
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
    source: 'public' as const,
  }));
}

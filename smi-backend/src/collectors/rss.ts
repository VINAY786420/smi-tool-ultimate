import 'dotenv/config';
import Parser from 'rss-parser';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

const parser = new Parser();

function getFeedUrls(): string[] {
  const raw = process.env.RSS_FEED_URLS || '';
  return raw
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
}

// keyword is used as a client-side filter across configured feeds (feeds themselves
// aren't keyword-searchable - they're fixed URLs you configure in .env).
export async function collectRss(keyword: string): Promise<CollectorResult> {
  const feedUrls = getFeedUrls();

  if (feedUrls.length === 0) {
    return {
      platform: 'RSS Feeds',
      mode: 'unavailable',
      rows: [],
      note: 'No RSS_FEED_URLS configured in .env - add comma-separated feed URLs to enable this collector.',
    };
  }

  const rows: CollectedDataInsert[] = [];
  const lowerKeyword = keyword.toLowerCase();

  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const item of feed.items || []) {
        const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
        if (!text.includes(lowerKeyword)) continue; // only keep items matching the keyword

        rows.push({
          platform: 'RSS Feeds',
          platform_type: 'News',
          data_type: 'article',
          keyword,
          title: item.title || null,
          content: item.contentSnippet?.slice(0, 2000) || null,
          author: item.creator || null,
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
          language: null,
          entities: [],
          topics: [],
          virality_score: null,
          bot_score: null,
          source: 'public',
        });
      }
    } catch (err) {
      console.warn(`[rss] failed to read feed ${feedUrl}: ${(err as Error).message}`);
    }
  }

  return { platform: 'RSS Feeds', mode: 'public', rows: rows.slice(0, 50) };
}

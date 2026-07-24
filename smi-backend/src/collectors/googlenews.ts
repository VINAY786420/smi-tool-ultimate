import type { CollectorResult } from '../lib/types.js';
import { fetchGoogleNewsRss } from '../lib/googleNewsRss.js';

export async function collectGoogleNews(keyword: string): Promise<CollectorResult> {
  const rows = await fetchGoogleNewsRss(keyword);
  return { platform: 'Google News', mode: 'public', rows };
}

import 'dotenv/config';
import { supabase } from './lib/supabase.js';
import { getKeywords } from './lib/config.js';
import { startJob, completeJob, failJob } from './lib/jobs.js';
import { collectReddit } from './collectors/reddit.js';
import { collectYoutube } from './collectors/youtube.js';
import { collectNewsApi } from './collectors/newsapi.js';
import { collectRss } from './collectors/rss.js';
import { collectGoogleNews } from './collectors/googlenews.js';
import { collectTwitter } from './collectors/twitter.js';
import { collectInstagram } from './collectors/instagram.js';
import { collectFacebook } from './collectors/facebook.js';
import { collectLinkedin } from './collectors/linkedin.js';
import { collectTiktok } from './collectors/tiktok.js';
import { collectPinterest } from './collectors/pinterest.js';
import { collectSnapchat } from './collectors/snapchat.js';
import { collectThreads } from './collectors/threads.js';
import { collectAmazon } from './collectors/amazon.js';
import { collectFlipkart } from './collectors/flipkart.js';
import { unavailableMarketplace } from './collectors/noPublicApi.js';
import type { CollectorResult } from './lib/types.js';

// Registry of available collectors. Add new platforms here as they're built.
const COLLECTORS: Record<string, (keyword: string) => Promise<CollectorResult>> = {
  reddit: collectReddit,
  youtube: collectYoutube,
  newsapi: collectNewsApi,
  rss: collectRss,
  googlenews: collectGoogleNews,
  twitter: collectTwitter,
  instagram: collectInstagram,
  facebook: collectFacebook,
  linkedin: collectLinkedin,
  tiktok: collectTiktok,
  pinterest: collectPinterest,
  snapchat: collectSnapchat,
  threads: collectThreads,
  amazon: collectAmazon,
  flipkart: collectFlipkart,
  meesho: unavailableMarketplace('Meesho'),
  myntra: unavailableMarketplace('Myntra'),
  nykaa: unavailableMarketplace('Nykaa'),
};

// Human-readable platform names for job records. Using collector.name (the JS function
// name, e.g. "collectReddit") was a bug - it wouldn't match the 'platform' values stored
// in collected_data rows (e.g. "Reddit"). This map keeps job records and data rows consistent.
const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
  reddit: 'Reddit',
  youtube: 'YouTube',
  newsapi: 'NewsAPI',
  rss: 'RSS Feeds',
  googlenews: 'Google News',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  snapchat: 'Snapchat',
  threads: 'Threads',
  amazon: 'Amazon India',
  flipkart: 'Flipkart',
  meesho: 'Meesho',
  myntra: 'Myntra',
  nykaa: 'Nykaa',
};

async function runOne(platformKey: string, keyword: string) {
  const collector = COLLECTORS[platformKey];
  if (!collector) {
    console.error(`Unknown collector: ${platformKey}. Available: ${Object.keys(COLLECTORS).join(', ')}`);
    return;
  }

  const displayName = PLATFORM_DISPLAY_NAMES[platformKey] || platformKey;
  const jobId = await startJob(displayName, keyword);
  console.log(`\n[${platformKey}] collecting for keyword "${keyword}"...`);

  try {
    const result = await collector(keyword);
    console.log(`[${result.platform}] mode=${result.mode} fetched=${result.rows.length} rows`);
    if (result.note) console.log(`[${result.platform}] note: ${result.note}`);

    if (result.rows.length > 0) {
      const { error } = await supabase.from('collected_data').insert(result.rows);
      if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    }

    // 'unavailable' (e.g. YouTube with no key) is a expected, non-error state - still marks
    // the job completed so it doesn't clutter the Jobs page as a failure.
    await completeJob(jobId, result.rows.length);
    console.log(`[${result.platform}] done - inserted ${result.rows.length} rows (mode: ${result.mode})`);
  } catch (err) {
    const message = (err as Error).message;
    console.error(`[${platformKey}] FAILED: ${message}`);
    await failJob(jobId, message);
  }
}

async function main() {
  const arg = process.argv[2];
  const keywords = getKeywords();

  if (!arg) {
    console.log('Usage: npm run collect -- <platform|all>');
    console.log(`Available platforms: ${Object.keys(COLLECTORS).join(', ')}, all`);
    process.exit(1);
  }

  const platforms = arg === 'all' ? Object.keys(COLLECTORS) : [arg];

  for (const platform of platforms) {
    for (const keyword of keywords) {
      await runOne(platform, keyword);
    }
  }

  console.log('\nAll collection runs finished.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

import type { CollectorResult } from '../lib/types.js';

// Meesho, Myntra, and Nykaa don't publish any self-serve public or affiliate API for
// product/listing data (unlike Amazon or Flipkart). Their Terms of Service prohibit
// scraping. The only legitimate route is a direct enterprise/brand-partner data-sharing
// agreement with the company itself - not something any API key can unlock here.
export function unavailableMarketplace(platform: string): (keyword: string) => Promise<CollectorResult> {
  return async (_keyword: string) => ({
    platform,
    mode: 'unavailable',
    rows: [],
    note: `${platform} has no public or self-serve affiliate API. Data access would require ` +
      `a direct enterprise partnership with ${platform} - it isn't something any key/token can enable here.`,
  });
}

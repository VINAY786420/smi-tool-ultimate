import type { CollectorResult } from '../lib/types.js';

// Snapchat is a permanent 'unavailable'. Unlike the other platforms, there is no
// credential that unlocks this: Snap's public developer platform only offers a
// Marketing/Ads API and a Creative Kit (for sharing content INTO Snapchat) - there is
// no API to read posts, stories, or search content, for your own account or anyone
// else's. There is nothing to configure here.
export async function collectSnapchat(_keyword: string): Promise<CollectorResult> {
  return {
    platform: 'Snapchat',
    mode: 'unavailable',
    rows: [],
    note:
      'Snapchat has no content-read API at all (only Ads/Marketing API and Creative Kit ' +
      'for posting content, not reading it). This collector cannot be enabled with any key.',
  };
}

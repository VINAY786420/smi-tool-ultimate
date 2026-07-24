import 'dotenv/config';
import type { CollectedDataInsert, CollectorResult } from '../lib/types.js';

interface LinkedinPost {
  id: string;
  commentary?: string;
  createdAt?: number;
}

// LinkedIn's API has no public keyword search for posts at all - the Marketing API
// (which needs Partner Program approval) only exposes an organization's own posts.
async function fetchOwnOrgPosts(keyword: string): Promise<CollectedDataInsert[]> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN!;
  const orgUrn = process.env.LINKEDIN_ORG_URN!; // e.g. urn:li:organization:12345678

  const res = await fetch(
    `https://api.linkedin.com/v2/posts?author=${encodeURIComponent(orgUrn)}&q=author&count=25`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    }
  );
  if (!res.ok) {
    throw new Error(`LinkedIn API failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { elements: LinkedinPost[] };
  const lowerKeyword = keyword.toLowerCase();

  return (json.elements || [])
    .filter((p) => (p.commentary || '').toLowerCase().includes(lowerKeyword))
    .map((p) => ({
      platform: 'LinkedIn',
      platform_type: 'Social' as const,
      data_type: 'post',
      keyword,
      title: null,
      content: p.commentary?.slice(0, 2000) || null,
      author: null,
      url: null,
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
      source: 'api' as const,
    }));
}

export async function collectLinkedin(keyword: string): Promise<CollectorResult> {
  if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_ORG_URN) {
    return {
      platform: 'LinkedIn',
      mode: 'unavailable',
      rows: [],
      note:
        'LINKEDIN_ACCESS_TOKEN / LINKEDIN_ORG_URN not set. LinkedIn has no public keyword ' +
        'search API - the Marketing API (needs Partner Program approval) only exposes your ' +
        "own organization's posts, filtered by keyword locally.",
    };
  }
  return { platform: 'LinkedIn', mode: 'api', rows: await fetchOwnOrgPosts(keyword) };
}

import type { Platform } from '@/types';

export const PLATFORMS: Platform[] = [
  { name: 'Twitter/X', type: 'Social', hasApi: true, public: true, priority: 'P0', color: '#1d9bf0' },
  { name: 'Instagram', type: 'Social', hasApi: true, public: true, priority: 'P0', color: '#e1306c' },
  { name: 'Facebook', type: 'Social', hasApi: true, public: true, priority: 'P0', color: '#1877f2' },
  { name: 'Reddit', type: 'Social', hasApi: true, public: true, priority: 'P0', color: '#ff4500' },
  { name: 'LinkedIn', type: 'Social', hasApi: true, public: true, priority: 'P0', color: '#0a66c2' },
  { name: 'TikTok', type: 'Social', hasApi: false, public: true, priority: 'P0', color: '#000000' },
  { name: 'YouTube', type: 'Social', hasApi: true, public: true, priority: 'P0', color: '#ff0000' },
  { name: 'Pinterest', type: 'Social', hasApi: false, public: true, priority: 'P1', color: '#bd081c' },
  { name: 'Snapchat', type: 'Social', hasApi: false, public: true, priority: 'P1', color: '#fffc00' },
  { name: 'Threads', type: 'Social', hasApi: false, public: true, priority: 'P1', color: '#654ff0' },
  { name: 'Amazon India', type: 'Marketplace', hasApi: false, public: true, priority: 'P0', color: '#ff9900' },
  { name: 'Flipkart', type: 'Marketplace', hasApi: false, public: true, priority: 'P0', color: '#2874f0' },
  { name: 'Meesho', type: 'Marketplace', hasApi: false, public: true, priority: 'P1', color: '#f43397' },
  { name: 'Myntra', type: 'Marketplace', hasApi: false, public: true, priority: 'P1', color: '#ff3f6c' },
  { name: 'Nykaa', type: 'Marketplace', hasApi: false, public: true, priority: 'P1', color: '#fc2779' },
  { name: 'NewsAPI', type: 'News', hasApi: true, public: true, priority: 'P0', color: '#1a8917' },
  { name: 'RSS Feeds', type: 'News', hasApi: false, public: true, priority: 'P0', color: '#ff8800' },
  { name: 'Google News', type: 'News', hasApi: false, public: true, priority: 'P0', color: '#4285f4' },
];

export const SENTIMENT_COLORS: Record<string, string> = { Positive: '#10b981', Negative: '#ef4444', Neutral: '#6b7280' };
export const SEVERITY_COLORS: Record<string, string> = { critical: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
export const JOB_STATUS_COLORS: Record<string, string> = { pending: '#6b7280', running: '#3b82f6', completed: '#10b981', failed: '#ef4444' };
export const REPORT_TYPE_COLORS: Record<string, string> = { PDF: '#ef4444', Excel: '#10b981', CSV: '#6b7280', HTML: '#f59e0b', PPTX: '#f97316', JSON: '#3b82f6' };

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}
export function formatPrice(n: number | null): string { return n === null ? '-' : '\u20B9' + n.toLocaleString('en-IN'); }
export function timeAgo(s: string): string {
  const d = new Date(s); const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

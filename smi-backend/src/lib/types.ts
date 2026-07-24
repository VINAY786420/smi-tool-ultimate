// Mirrors src/types/index.ts on the frontend + the collected_data / jobs tables.

export interface CollectedDataInsert {
  platform: string;
  platform_type: 'Social' | 'Marketplace' | 'News';
  data_type: string; // 'post' | 'comment' | 'video' | 'article' | 'product' ...
  keyword: string;
  title?: string | null;
  content?: string | null;
  author?: string | null;
  url?: string | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  views?: number | null;
  price?: number | null;
  rating?: number | null;
  sentiment?: 'Positive' | 'Negative' | 'Neutral' | null;
  sentiment_score?: number | null;
  emotion?: string | null;
  emotion_score?: number | null;
  language?: string | null;
  entities?: string[];
  topics?: string[];
  virality_score?: number | null;
  bot_score?: number | null;
  source: 'api' | 'public' | 'demo'; // api = authenticated official API, public = no-auth public endpoint, demo = placeholder
}

export interface CollectorResult {
  platform: string;
  // 'unavailable' = no key configured AND no legitimate public fallback exists for this platform,
  // so 0 rows are returned rather than faking data.
  mode: 'api' | 'public' | 'demo' | 'unavailable';
  rows: CollectedDataInsert[];
  note?: string;
}

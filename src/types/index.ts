export interface CollectedData {
  id: string; platform: string; platform_type: string; data_type: string; keyword: string;
  title: string | null; content: string | null; author: string | null; url: string | null;
  likes: number | null; comments: number | null; shares: number | null; views: number | null;
  price: number | null; rating: number | null; sentiment: string | null; sentiment_score: number | null;
  emotion: string | null; emotion_score: number | null; language: string | null;
  entities: string[]; topics: string[]; virality_score: number | null; bot_score: number | null;
  collected_at: string; source: string;
}
export interface Trend { id: string; platform: string; platform_type: string; keyword: string; hashtag: string | null; volume: number; growth_rate: number; peak_time: string | null; predicted_peak: string | null; recorded_at: string; }
export interface Analytics { id: string; keyword: string; platform: string | null; total_mentions: number; positive_pct: number; negative_pct: number; neutral_pct: number; avg_engagement: number; top_platform: string | null; top_influencers: { username: string; score: number }[]; trending_topics: string[]; virality_stats: { avg_virality?: number; peak_day?: string }; generated_at: string; }
export interface Report { id: string; report_type: string; filename: string; file_path: string; file_size: number; keywords: string | null; platforms: string | null; is_scheduled: boolean; generated_at: string; }
export interface Job { id: string; job_type: string; priority: number; status: string; platform: string | null; keyword: string | null; scheduled_at: string | null; started_at: string | null; completed_at: string | null; retry_count: number; error_message: string | null; payload: Record<string, unknown>; created_at: string; }
export interface Alert { id: string; alert_type: string; severity: string; platform: string | null; keyword: string | null; message: string; triggered_at: string; acknowledged: boolean; resolved: boolean; sent_to: string[]; }
export interface Webhook { id: string; name: string; url: string; events: string | null; headers: string | null; active: boolean; created_at: string; }
export interface Influencer { id: string; platform: string; username: string; full_name: string | null; followers: number; engagement_rate: number; avg_likes: number; avg_comments: number; avg_shares: number; score: number; sentiment_score: number; virality_score: number; last_updated: string | null; profile_url: string | null; verified: boolean; }
export interface UserPreference { id: string; user_id: string | null; preference_key: string; preference_value: string | null; updated_at: string; }
export interface Platform { name: string; type: string; hasApi: boolean; public: boolean; priority: 'P0' | 'P1' | 'P2'; color: string; }

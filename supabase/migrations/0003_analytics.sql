/*
  # analytics — AI Analytics page

  Used by: src/pages/AnalyticsPage.tsx

  Columns match src/types/index.ts Analytics interface.
  top_influencers: { username: string; score: number }[]
  virality_stats:  { avg_virality?: number; peak_day?: string }
*/

create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  platform text,
  total_mentions integer not null default 0,
  positive_pct numeric not null default 0,
  negative_pct numeric not null default 0,
  neutral_pct numeric not null default 0,
  avg_engagement numeric not null default 0,
  top_platform text,
  top_influencers jsonb not null default '[]',
  trending_topics text[] not null default '{}',
  virality_stats jsonb not null default '{}',
  generated_at timestamptz not null default now()
);

create index if not exists idx_analytics_generated_at on analytics (generated_at desc);

alter table analytics enable row level security;

create policy "public read/write analytics" on analytics for all using (true) with check (true);

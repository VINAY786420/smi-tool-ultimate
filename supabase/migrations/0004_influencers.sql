/*
  # influencers — Influencers page

  Used by: src/pages/InfluencersPage.tsx, src/pages/DashboardPage.tsx,
           src/pages/AnalyticsPage.tsx (top_influencers references)

  Columns match src/types/index.ts Influencer interface.
  Search index supports InfluencersPage's
  .or(`username.ilike...,full_name.ilike...`) filter.
*/

create table if not exists influencers (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  username text not null,
  full_name text,
  followers bigint not null default 0,
  engagement_rate numeric not null default 0,
  avg_likes bigint not null default 0,
  avg_comments bigint not null default 0,
  avg_shares bigint not null default 0,
  score numeric not null default 0,
  sentiment_score numeric not null default 0,
  virality_score numeric not null default 0,
  last_updated timestamptz,
  profile_url text,
  verified boolean not null default false
);

create index if not exists idx_influencers_score on influencers (score desc);
create index if not exists idx_influencers_platform on influencers (platform);
create index if not exists idx_influencers_username_trgm on influencers using gin (username gin_trgm_ops);

alter table influencers enable row level security;

create policy "public read/write influencers" on influencers for all using (true) with check (true);

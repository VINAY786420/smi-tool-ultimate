/*
  # collected_data — Data Collection page

  Used by: src/pages/CollectionPage.tsx, src/pages/DashboardPage.tsx

  Columns match src/types/index.ts CollectedData interface.
  Search index supports CollectionPage's
  .or(`keyword.ilike...,title.ilike...,author.ilike...`) filter.
*/

create table if not exists collected_data (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  platform_type text not null,
  data_type text not null,
  keyword text not null,
  title text,
  content text,
  author text,
  url text,
  likes integer,
  comments integer,
  shares integer,
  views integer,
  price numeric,
  rating numeric,
  sentiment text check (sentiment in ('Positive', 'Negative', 'Neutral')),
  sentiment_score numeric,
  emotion text,
  emotion_score numeric,
  language text,
  entities text[] not null default '{}',
  topics text[] not null default '{}',
  virality_score numeric,
  bot_score numeric,
  collected_at timestamptz not null default now(),
  source text not null default 'api'
);

create index if not exists idx_collected_data_platform on collected_data (platform);
create index if not exists idx_collected_data_data_type on collected_data (data_type);
create index if not exists idx_collected_data_collected_at on collected_data (collected_at desc);
create index if not exists idx_collected_data_keyword_trgm on collected_data using gin (keyword gin_trgm_ops);

alter table collected_data enable row level security;

-- App has no auth (src/lib/supabase.ts: persistSession false, anon key only).
-- Policy is permissive; tighten before shipping to real users.
create policy "public read/write collected_data" on collected_data for all using (true) with check (true);

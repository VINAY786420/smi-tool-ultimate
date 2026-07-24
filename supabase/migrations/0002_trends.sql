/*
  # trends — Trends page

  Used by: src/pages/TrendsPage.tsx

  Columns match src/types/index.ts Trend interface.
*/

create table if not exists trends (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  platform_type text not null,
  keyword text not null,
  hashtag text,
  volume integer not null default 0,
  growth_rate numeric not null default 0,
  peak_time timestamptz,
  predicted_peak timestamptz,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_trends_volume on trends (volume desc);
create index if not exists idx_trends_platform on trends (platform);

alter table trends enable row level security;

create policy "public read/write trends" on trends for all using (true) with check (true);

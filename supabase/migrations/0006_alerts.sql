/*
  # alerts — Alerts page

  Used by: src/pages/AlertsPage.tsx, src/pages/DashboardPage.tsx, src/App.tsx

  Columns match src/types/index.ts Alert interface.
*/

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  severity text not null check (severity in ('critical', 'warning', 'info')),
  platform text,
  keyword text,
  message text not null,
  triggered_at timestamptz not null default now(),
  acknowledged boolean not null default false,
  resolved boolean not null default false,
  sent_to text[] not null default '{}'
);

create index if not exists idx_alerts_severity on alerts (severity);
create index if not exists idx_alerts_resolved on alerts (resolved);
create index if not exists idx_alerts_triggered_at on alerts (triggered_at desc);

alter table alerts enable row level security;

create policy "public read/write alerts" on alerts for all using (true) with check (true);

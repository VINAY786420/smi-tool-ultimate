/*
  # jobs — Jobs page

  Used by: src/pages/JobsPage.tsx, src/pages/DashboardPage.tsx, src/App.tsx

  Columns match src/types/index.ts Job interface.
*/

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  priority integer not null default 3,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  platform text,
  keyword text,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  retry_count integer not null default 0,
  error_message text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_status on jobs (status);
create index if not exists idx_jobs_created_at on jobs (created_at desc);

alter table jobs enable row level security;

create policy "public read/write jobs" on jobs for all using (true) with check (true);

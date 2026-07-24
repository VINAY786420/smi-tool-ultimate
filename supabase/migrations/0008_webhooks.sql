/*
  # webhooks — Integrations page

  Used by: src/pages/IntegrationsPage.tsx

  Columns match src/types/index.ts Webhook interface.
  events is stored comma-separated and split client-side.
*/

create table if not exists webhooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  events text,
  headers text default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_webhooks_created_at on webhooks (created_at desc);

alter table webhooks enable row level security;

create policy "public read/write webhooks" on webhooks for all using (true) with check (true);

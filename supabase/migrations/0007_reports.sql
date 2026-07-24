/*
  # reports — Reports page

  Used by: src/pages/ReportsPage.tsx

  Columns match src/types/index.ts Report interface.
  file_size is stored in bytes; UI divides by 1024 to display MB.
*/

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null check (report_type in ('PDF', 'Excel', 'CSV', 'HTML', 'PPTX', 'JSON')),
  filename text not null,
  file_path text not null,
  file_size integer not null default 0,
  keywords text,
  platforms text,
  is_scheduled boolean not null default false,
  generated_at timestamptz not null default now()
);

create index if not exists idx_reports_generated_at on reports (generated_at desc);

alter table reports enable row level security;

create policy "public read/write reports" on reports for all using (true) with check (true);

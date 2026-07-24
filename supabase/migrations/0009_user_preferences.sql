/*
  # user_preferences — Settings page

  Used by: src/pages/SettingsPage.tsx

  Columns match src/types/index.ts UserPreference interface.
  user_id is nullable since the app has no auth (single global
  preference set); the unique constraint still prevents duplicate
  keys within the same user_id value.
*/

create table if not exists user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  preference_key text not null,
  preference_value text,
  updated_at timestamptz not null default now(),
  unique (user_id, preference_key)
);

alter table user_preferences enable row level security;

create policy "public read/write user_preferences" on user_preferences for all using (true) with check (true);

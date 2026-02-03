create table if not exists public.activities (
  activity_id bigint primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  start_time timestamptz,
  duration_seconds integer,
  name text,
  distance_meters numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_user_id_idx on public.activities (user_id);

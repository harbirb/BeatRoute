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

-- Enable RLS
alter table public.activities enable row level security;

-- Users can only view their own activities
create policy "Users can view own activities"
  on public.activities for select
  using (auth.uid() = user_id);

-- Users can only insert their own activities
create policy "Users can insert own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

-- Users can only update their own activities
create policy "Users can update own activities"
  on public.activities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only delete their own activities
create policy "Users can delete own activities"
  on public.activities for delete
  using (auth.uid() = user_id);

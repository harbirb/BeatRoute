
-- Enable RLS on activity_songs
alter table public.activity_songs enable row level security;

-- Create policy for activity_songs: Users can view songs for their own activities
create policy "Users can view songs for own activities"
  on public.activity_songs for select
  using (
    exists (
      select 1 from public.activities
      where activities.activity_id = activity_songs.activity_id
      and activities.user_id = auth.uid()
    )
  );

-- Enable RLS on songs
alter table public.songs enable row level security;

-- Create policy for songs: Everyone can view song metadata (since it's just public Spotify data)
create policy "Everyone can view songs"
  on public.songs for select
  using (true);

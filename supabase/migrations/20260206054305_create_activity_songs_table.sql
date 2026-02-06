create table if not exists activity_songs (
    activity_id bigint not null references public.activities(activity_id) on delete cascade,
    song_id text not null references public.songs(id) on delete cascade,
    played_at timestamptz not null,
    primary key (activity_id, song_id, played_at)
);

alter table activity_songs disable row level security;

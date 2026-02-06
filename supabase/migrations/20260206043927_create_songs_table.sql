create table if not exists songs (
    id text primary key,
    title text not null,
    artists text[] not null,
    album_art_url text,
    spotify_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table songs disable row level security;

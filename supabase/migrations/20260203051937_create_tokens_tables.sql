create table if not exists public.strava_tokens (
	user_id uuid not null references auth.users(id) on delete cascade,
	athlete_id bigint not null,
	access_token text not null,
	refresh_token text not null,
	expires_at bigint not null,
	primary key (user_id),
	unique (athlete_id)
);

alter table public.strava_tokens enable row level security;

create policy "Service role can read strava tokens" on public.strava_tokens
	as permissive
	for select
	to service_role
	using (true);

create table if not exists public.spotify_tokens (
	user_id uuid not null references auth.users(id) on delete cascade,
	access_token text not null,
	refresh_token text not null,
	expires_at bigint not null,
	primary key (user_id)
);

alter table public.spotify_tokens enable row level security;

create policy "Service role can read spotify tokens" on public.spotify_tokens
	as permissive
	for select
	to service_role
	using (true);

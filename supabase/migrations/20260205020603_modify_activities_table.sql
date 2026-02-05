alter table public.activities
	rename column duration_seconds to moving_time_seconds;

alter table public.activities
	add column if not exists athlete_id bigint,
	add column if not exists activity_type text,
	add column if not exists summary_polyline text,
	add column if not exists elapsed_time_seconds integer,
	add column if not exists raw_data jsonb;

create or replace function public.set_updated_at()
returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

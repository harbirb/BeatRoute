create table "public"."tracklists" (
    "activity_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "tracklist" jsonb,
    "start_date" text,
    "name" text,
    "distance" double precision
);


alter table "public"."tracklists" enable row level security;

CREATE UNIQUE INDEX tracklists_activity_id_key ON public.tracklists USING btree (activity_id);

CREATE UNIQUE INDEX tracklists_pkey ON public.tracklists USING btree (activity_id);

alter table "public"."tracklists" add constraint "tracklists_pkey" PRIMARY KEY using index "tracklists_pkey";

alter table "public"."tracklists" add constraint "tracklists_activity_id_key" UNIQUE using index "tracklists_activity_id_key";

grant delete on table "public"."tracklists" to "anon";

grant insert on table "public"."tracklists" to "anon";

grant references on table "public"."tracklists" to "anon";

grant select on table "public"."tracklists" to "anon";

grant trigger on table "public"."tracklists" to "anon";

grant truncate on table "public"."tracklists" to "anon";

grant update on table "public"."tracklists" to "anon";

grant delete on table "public"."tracklists" to "authenticated";

grant insert on table "public"."tracklists" to "authenticated";

grant references on table "public"."tracklists" to "authenticated";

grant select on table "public"."tracklists" to "authenticated";

grant trigger on table "public"."tracklists" to "authenticated";

grant truncate on table "public"."tracklists" to "authenticated";

grant update on table "public"."tracklists" to "authenticated";

grant delete on table "public"."tracklists" to "service_role";

grant insert on table "public"."tracklists" to "service_role";

grant references on table "public"."tracklists" to "service_role";

grant select on table "public"."tracklists" to "service_role";

grant trigger on table "public"."tracklists" to "service_role";

grant truncate on table "public"."tracklists" to "service_role";

grant update on table "public"."tracklists" to "service_role";

create policy "tracklist insert"
on "public"."tracklists"
as permissive
for insert
to public
with check (true);


create policy "tracklist"
on "public"."tracklists"
as permissive
for select
to public
using (true);




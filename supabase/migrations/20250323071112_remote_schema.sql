create table "public"."spotify_tokens" (
    "user_id" uuid not null,
    "access_token" text not null,
    "refresh_token" text not null,
    "expires_at" bigint not null
);


alter table "public"."spotify_tokens" enable row level security;

CREATE UNIQUE INDEX spotify_tokens_pkey ON public.spotify_tokens USING btree (user_id);

alter table "public"."spotify_tokens" add constraint "spotify_tokens_pkey" PRIMARY KEY using index "spotify_tokens_pkey";

alter table "public"."spotify_tokens" add constraint "spotify_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."spotify_tokens" validate constraint "spotify_tokens_user_id_fkey";

grant delete on table "public"."spotify_tokens" to "anon";

grant insert on table "public"."spotify_tokens" to "anon";

grant references on table "public"."spotify_tokens" to "anon";

grant select on table "public"."spotify_tokens" to "anon";

grant trigger on table "public"."spotify_tokens" to "anon";

grant truncate on table "public"."spotify_tokens" to "anon";

grant update on table "public"."spotify_tokens" to "anon";

grant delete on table "public"."spotify_tokens" to "authenticated";

grant insert on table "public"."spotify_tokens" to "authenticated";

grant references on table "public"."spotify_tokens" to "authenticated";

grant select on table "public"."spotify_tokens" to "authenticated";

grant trigger on table "public"."spotify_tokens" to "authenticated";

grant truncate on table "public"."spotify_tokens" to "authenticated";

grant update on table "public"."spotify_tokens" to "authenticated";

grant delete on table "public"."spotify_tokens" to "service_role";

grant insert on table "public"."spotify_tokens" to "service_role";

grant references on table "public"."spotify_tokens" to "service_role";

grant select on table "public"."spotify_tokens" to "service_role";

grant trigger on table "public"."spotify_tokens" to "service_role";

grant truncate on table "public"."spotify_tokens" to "service_role";

grant update on table "public"."spotify_tokens" to "service_role";



drop extension if exists "pg_net";


  create policy "Enable users to view their own data only"
  on "public"."spotify_tokens"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."strava_tokens"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));




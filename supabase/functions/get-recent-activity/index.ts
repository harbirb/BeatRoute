// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getTokens } from "../_shared/get-tokens.ts";

// invoked without any params, gets users strava token, and fetches most recent activity from api
Deno.serve(async (req) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // get user
  const { data: userData, error: authError } =
    await supabaseClient.auth.getUser(token);
  if (authError || !userData?.user)
    return jsonResponse(401, { error: "Unauthorized" });

  const userId = userData.user.id;

  // get strava token
  const stravaToken = await getTokens(userId, "strava");

  // get recent activity
  const NOW = Date.now() / 1000;
  const WEEK_AGO = NOW - 100 * 24 * 60 * 60;
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?before=${NOW}&after=${WEEK_AGO}&per_page=5`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stravaToken}`,
      },
    }
  );
  const data = await response.json();
  console.log(data);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-recent-activity' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const stravaApiUrl = "https://www.strava.com/api/v3/oauth/token";

Deno.serve(async (req: Request) => {
  const stravaClientId = Deno.env.get("STRAVA_CLIENT_ID");
  const stravaClientSecret = Deno.env.get("STRAVA_CLIENT_SECRET");
  if (!stravaClientId || !stravaClientSecret) {
    return new Response("Missing Strava client ID or secret.", { status: 500 });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data: user, error } = await supabaseClient.auth.getUser(token);
  if (error || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { code, athlete_id } = await req.json();
  if (!code || !athlete_id) {
    return new Response("Missing authorization code or athlete ID.", {
      status: 400,
    });
  }

  const requestBody = new URLSearchParams({
    client_id: stravaClientId,
    client_secret: stravaClientSecret,
    code: code,
    grant_type: "authorization_code",
  });

  try {
    // Make a POST request to exchange the code for the access token
    const response = await fetch(stravaApiUrl, {
      method: "POST",
      body: requestBody,
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { access_token, refresh_token, expires_at } = data;
    const { error: dbError } = await supabase.from("strava_tokens").upsert(
      {
        user_id: user.id,
        athlete_id,
        access_token,
        refresh_token,
        expires_at,
      },
      { onConflict: ["user_id"] }
    );

    if (error) {
      return new Response("Failed to store tokens in database.", {
        status: 500,
      });
    }
    return new Response("Tokens stored successfully.", { status: 200 });
  } catch (error) {
    return new Response("Error exchanging token with Strava.", { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/exchange-strava-token' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

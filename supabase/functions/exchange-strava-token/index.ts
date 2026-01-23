// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    const stravaClientId = Deno.env.get("STRAVA_CLIENT_ID");
    const stravaClientSecret = Deno.env.get("STRAVA_CLIENT_SECRET");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // check env vars
    if (!stravaClientId || !stravaClientSecret) {
      return jsonResponse(400, { error: "Missing Strava client ID or secret" });
    }

    // get token
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return jsonResponse(401, { error: "Missing authorization token" });
    }

    // get user
    const { data: userData, error: authError } = await supabaseClient.auth
      .getUser(token);
    if (authError || !userData?.user) {
      return jsonResponse(401, { error: "Unauthorized" });
    }

    const { code } = await req.json();
    if (!code) {
      return jsonResponse(400, { error: "Missing Strava authorization code" });
    }

    // Exchange code for Strava tokens
    const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: stravaClientId,
        client_secret: stravaClientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    // check response from strava
    const stravaData = await response.json();
    if (!response.ok) {
      return jsonResponse(response.status, {
        error: "Strava token exchange failed",
        details: stravaData,
      });
    }

    // store tokens
    const { access_token, refresh_token, expires_at, athlete } = stravaData;
    const { error: dbError } = await supabaseClient
      .from("strava_tokens")
      .upsert(
        {
          user_id: userData.user.id,
          athlete_id: athlete.id,
          access_token,
          refresh_token,
          expires_at,
        },
        { onConflict: ["user_id"] },
      );

    if (dbError) {
      return jsonResponse(500, {
        error: "Database insert failed",
        details: dbError.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Tokens stored successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return jsonResponse(500, { error: "Internal server error" });
  }
});

function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

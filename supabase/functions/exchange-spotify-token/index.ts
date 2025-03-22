// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("You called spotify auth endpoint!");

Deno.serve(async (req) => {
  // console.log(req);
  try {
    const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID");
    const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET");
    const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // check env vars
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET)
      return jsonResponse(400, {
        error: "Missing Spotify client ID or secret",
      });

    // get token
    console.log(req);
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return jsonResponse(401, { error: "Missing authorization token" });

    // get user
    const { data: userData, error: authError } =
      await supabaseClient.auth.getUser(token);
    if (authError || !userData?.user)
      return jsonResponse(401, { error: "Unauthorized" });

    const { code } = await req.json();
    if (!code)
      return jsonResponse(400, { error: "Missing Spotify authorization code" });

    // Exchange code for Spotify tokens
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
    });

    const spotifyData = await response.json();
    if (!response.ok)
      return jsonResponse(response.status, {
        error: "Spotify token exchange failed",
        details: spotifyData,
      });

    // store tokens
    const { access_token, refresh_token, expires_at } = spotifyData;
    // const { error: dbError } = await supabaseClient
    //   .from("spotify_tokens")
    //   .upsert(

    //   )
  } catch (error) {
    // print to console
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

// This function contains the logic for getting access tokens
// if a token has not yet expired, it will return the token
// otherwise, it refreshes the token and updates the token in the database and then returns it
//
// TODO: what if a user revokes access?
// TODO: what if a user resets their password?

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface RefreshTokenResult {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

const refreshTokenMap = {
  strava: refreshStravaToken,
  spotify: refreshSpotifyToken,
};

Deno.serve(async (req) => {
  try {
    const { service } = await req.json();
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!service || !jwt)
      return jsonResponse(400, { error: "Missing service or jwt" });
    if (!refreshTokenMap[service])
      return jsonResponse(400, { error: `Invalid service: ${service}` });

    const {
      data: { user },
    } = await supabase.auth.getUser(jwt);
    if (!user)
      return jsonResponse(401, { error: "Unauthorized, user not found" });
    const userId = user.id;

    const table = service + "_tokens";
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error || !data) return jsonResponse(404, { error: "Token not found" });

    const { access_token, refresh_token, expires_at } = data;
    const now = getCurrentTimestamp();
    if (expires_at >= now) {
      return jsonResponse(200, { access_token });
    }

    const result = await refreshTokenMap[service](refresh_token);
    if (result) {
      await supabase.from(table).update(result).eq("user_id", userId);
      return jsonResponse(200, { access_token: result.access_token });
    }
  } catch (error) {
    console.error(error);
    return jsonResponse(400, { error: error.message });
  }
});

async function refreshStravaToken(
  refresh_token: string
): Promise<RefreshTokenResult> {
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id: Deno.env.get("STRAVA_CLIENT_ID")!,
      client_secret: Deno.env.get("STRAVA_CLIENT_SECRET")!,
    }),
  });
  const {
    access_token,
    refresh_token: newRefreshToken,
    expires_at,
  } = await response.json();
  return { access_token, refresh_token: newRefreshToken, expires_at };
}

async function refreshSpotifyToken(
  refresh_token: string
): Promise<RefreshTokenResult> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        `${Deno.env.get("SPOTIFY_CLIENT_ID")}:${Deno.env.get(
          "SPOTIFY_CLIENT_SECRET"
        )}`
      )}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  const { access_token, expires_in } = await response.json();
  const expires_at = getCurrentTimestamp() + expires_in;
  return { access_token, refresh_token, expires_at };
}

function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

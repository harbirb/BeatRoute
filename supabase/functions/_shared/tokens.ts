import "edge-runtime";
import { createClient } from "supabase";
import { ProviderName, PROVIDERS } from "./providers.ts";
import { StravaApi } from "strava-sdk";

interface RefreshTokenResult {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

type RefreshHandler = (refreshToken: string) => Promise<RefreshTokenResult>;

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const REFRESH_STRATEGIES: Record<ProviderName, RefreshHandler> = {
  strava: refreshStravaToken,
  spotify: refreshSpotifyToken,
};

export const getToken = async (
  userId: string,
  provider: ProviderName,
): Promise<string> => {
  const config = PROVIDERS[provider];
  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  const { data, error } = await supabaseAdmin
    .from(config.table)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error(`DB error for ${provider}:`, error);
    throw new Error("Token not found");
  }

  if (isExpired(data.expires_at)) {
    return await refreshAndUpdateTokens(userId, provider, data.refresh_token);
  }
  return data.access_token;
};

// Check if token has expired
function isExpired(expires_at: number): boolean {
  const bufferTime = 60;
  const now = Math.floor(Date.now() / 1000);
  return now > expires_at - bufferTime;
}

// Refresh access token, update DB, and return new token
async function refreshAndUpdateTokens(
  userId: string,
  provider: ProviderName,
  refreshToken: string,
): Promise<string> {
  console.log(`Refreshing token for ${provider} and user ${userId}`);
  const refreshFunction = REFRESH_STRATEGIES[provider];

  const refreshResult = await refreshFunction(refreshToken);
  const { error } = await supabaseAdmin.from(PROVIDERS[provider].table).update(
    refreshResult,
  ).eq("user_id", userId);
  if (error) {
    console.error(`DB error for ${provider}:`, error);
    throw new Error("Failed to update token");
  }
  return refreshResult.access_token;
}

async function refreshStravaToken(
  refreshToken: string,
): Promise<RefreshTokenResult> {
  const strava = new StravaApi({
    clientId: Deno.env.get("STRAVA_CLIENT_ID")!,
    clientSecret: Deno.env.get("STRAVA_CLIENT_SECRET")!,
  });
  const { access_token, refresh_token, expires_at } = await strava
    .refreshAccessToken(refreshToken);
  return { access_token, refresh_token, expires_at };
}

async function refreshSpotifyToken(
  refreshToken: string,
): Promise<RefreshTokenResult> {
  const clientId = Deno.env.get("SPOTIFY_CLIENT_ID")!;
  const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;
  const tokenUrl = "https://accounts.spotify.com/api/token";

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Spotify token refresh failed: ${response.status} ${errorBody}`,
    );
  }
  const data = await response.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
  };
}

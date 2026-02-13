import "edge-runtime";
import { ProviderName, PROVIDERS } from "./providers.ts";
import { StravaApi, StravaClient } from "strava-sdk";
import { supabaseAdmin } from "./supabaseAdmin.ts";

interface TokenResult {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete_id?: number;
}

type TokenHandler = (token: string) => Promise<TokenResult>;

const REFRESH_STRATEGIES: Record<ProviderName, TokenHandler> = {
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
): Promise<TokenResult> {
  const strava = new StravaApi({
    clientId: Deno.env.get(PROVIDERS.strava.clientIdEnv)!,
    clientSecret: Deno.env.get(PROVIDERS.strava.clientSecretEnv)!,
  });
  const { access_token, refresh_token, expires_at } = await strava
    .refreshAccessToken(refreshToken);
  return { access_token, refresh_token, expires_at };
}

async function refreshSpotifyToken(
  refreshToken: string,
): Promise<TokenResult> {
  const config = PROVIDERS.spotify;
  const clientId = Deno.env.get(config.clientIdEnv)!;
  const clientSecret = Deno.env.get(config.clientSecretEnv)!;

  const response = await fetch(config.tokenUrl, {
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

export async function exchangeStravaToken(code: string): Promise<TokenResult> {
  const strava = new StravaClient({
    clientId: Deno.env.get(PROVIDERS.strava.clientIdEnv)!,
    clientSecret: Deno.env.get(PROVIDERS.strava.clientSecretEnv)!,
    redirectUri: Deno.env.get(PROVIDERS.strava.redirectUriEnv)!,
    storage: { get: () => null, set: () => {}, delete: () => {} },
  });

  const tokens = await strava.oauth.exchangeCode(code);
  const { access_token, refresh_token, expires_at, athlete } = tokens;

  if (!athlete) {
    throw new Error("No athlete data returned from Strava");
  }

  return { access_token, refresh_token, expires_at, athlete_id: athlete.id };
}

export async function exchangeSpotifyToken(code: string): Promise<TokenResult> {
  const config = PROVIDERS.spotify;
  const clientId = Deno.env.get(config.clientIdEnv)!;
  const clientSecret = Deno.env.get(config.clientSecretEnv)!;
  const redirectUri = Deno.env.get(config.redirectUriEnv)!;

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Spotify token exchange failed: ${response.status} ${errorText}`,
    );
  }

  const data = await response.json();
  const { access_token, refresh_token, expires_in } = data;
  const expires_at = Math.floor(Date.now() / 1000) + expires_in;

  return { access_token, refresh_token, expires_at };
}

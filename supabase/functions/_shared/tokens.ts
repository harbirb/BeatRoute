import "edge-runtime";
import { createClient } from "supabase";
import { ProviderName, PROVIDERS } from "./providers.ts";
import { StravaApi } from "strava-sdk";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

export const getToken = async (
  userId: string,
  provider: ProviderName,
): Promise<string | null> => {
  try {
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
      return null;
    }
    if (isExpired(data.expires_at)) {
      return await refreshAndReturnToken(userId, provider, data.refresh_token);
    }
    return data.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Check if token has expired
function isExpired(expires_at: number): boolean {
  const bufferTime = 60;
  const now = Math.floor(Date.now() / 1000);
  return now > expires_at - bufferTime;
}

// Refresh access token, update DB, and return new token
async function refreshAndReturnToken(
  userId: string,
  provider: ProviderName,
  refreshToken: string,
): Promise<string | null> {
  // Placeholder for refresh logic
  console.log(`Refreshing token for ${provider} and user ${userId}`);
  const refreshFunction = REFRESH_STRATEGIES[provider];
  const refreshResult = await refreshFunction(refreshToken);
  await supabaseAdmin.from(PROVIDERS[provider].table).update(refreshResult).eq(
    "user_id",
    userId,
  );
  // Implement actual refresh logic here
  return refreshResult.access_token; // Return true if refresh is successful, false otherwise
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
  // Placeholder for refresh logic
  return {
    access_token: "j",
    refresh_token: "j",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };
}

type RefreshHandler = (refreshToken: string) => Promise<RefreshTokenResult>;
const REFRESH_STRATEGIES: Record<ProviderName, RefreshHandler> = {
  strava: refreshStravaToken,
  spotify: refreshSpotifyToken,
};

interface RefreshTokenResult {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

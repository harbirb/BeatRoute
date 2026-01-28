import "edge-runtime";
import { createClient } from "supabase";
import { ProviderName, PROVIDERS } from "./providers.ts";

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
      const refreshSuccess = refreshToken(userId, provider);
      if (!refreshSuccess) {
        console.error(`Failed to refresh token for ${provider}`);
        return null;
      }
      return await getToken(userId, provider);
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

// Refresh token function
// Return true if refresh is successful, false otherwise
function refreshToken(
  userId: string,
  provider: ProviderName,
): boolean {
  // Placeholder for refresh logic
  console.log(`Refreshing token for ${provider} and user ${userId}`);
  // Implement actual refresh logic here
  return true; // Return true if refresh is successful, false otherwise
}

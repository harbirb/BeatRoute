// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "edge-runtime";
import { createClient } from "supabase";
import { StravaClient } from "strava-sdk";

console.log("Hello from Functions!");
// Tokens should not be accessible from the client (No RLS access)
// Must use service role key to access
const VALID_PROVIDERS = ["strava", "spotify"] as const;
type Provider = typeof VALID_PROVIDERS[number];

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const strava = new StravaClient({
  clientId: Deno.env.get("STRAVA_CLIENT_ID")!,
  clientSecret: Deno.env.get("STRAVA_CLIENT_SECRET")!,
  redirectUri: "http://localhost:3000/auth/callback",
  storage: { get: () => null, set: () => {}, delete: () => {} },
});

export const exchangeHandler = async (req: Request) => {
  // Log request headers for debugging
  // const headersObject = Object.fromEntries(req.headers);
  // const headersJson = JSON.stringify(headersObject, null, 2);
  // console.log(`Request headers:\n${headersJson}`);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.error("Missing Authorization header");
    return Response.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (!user || error) {
    console.error("Unauthorized request to function", error?.message);
    return Response.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const { provider, code } = await req.json();
  if (!VALID_PROVIDERS.includes(provider as Provider) || !code) {
    console.error("Invalid provider or missing code");
    return Response.json({ msg: "Invalid provider or missing code" }, {
      status: 400,
    });
  }

  try {
    switch (provider) {
      case "strava":
        await handleStravaExchange(user.id, code);
        break;
      case "spotify":
        await handleSpotifyExchange(user.id, code);
        break;
      default:
        return Response.json({ msg: "Unsupported provider" }, { status: 400 });
    }

    return Response.json({ msg: "OAuth token exchanged successfully" }, {
      status: 200,
    });
  } catch (err) {
    console.error(`Error exchanging ${provider} code:`, err);
    return Response.json({ msg: `Failed to exchange ${provider} token` }, {
      status: 500,
    });
  }
};

/**
 * Strava-specific exchange logic
 */
async function handleStravaExchange(userId: string, code: string) {
  const tokens = await strava.oauth.exchangeCode(code);
  console.log("Exchanged Strava code for tokens", tokens);

  // TODO: Implement database storage using supabaseAdmin
  // await supabaseAdmin.from('strava_tokens').upsert({ user_id: userId, ...tokens });
}

/**
 * Spotify-specific exchange logic
 */
async function handleSpotifyExchange(userId: string, code: string) {
  // TODO: Implement Spotify token exchange logic
  // const tokens = await spotify.exchangeCode(code);
  console.log("Spotify exchange requested for user", userId);
}

if (import.meta.main) {
  Deno.serve(exchangeHandler);
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54381/functions/v1/exchange-oauth-token' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODQ1Nzc1MTF9.x8KBDbMFLwC_PBGEIayVzGt9RizkWJxB5ID_vR1LGR8soiUVO_1U3EYxYO0Xy5sT7tn37UnzqzdMC30T0InPiQ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

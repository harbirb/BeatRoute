// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "edge-runtime";
import { ProviderName, PROVIDERS } from "@/shared/providers.ts";
import { supabaseAdmin } from "@/shared/supabaseAdmin.ts";
import { exchangeSpotifyToken, exchangeStravaToken } from "@/shared/tokens.ts";

export const exchangeHandler = async (req: Request) => {
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
  if (!Object.keys(PROVIDERS).includes(provider) || !code) {
    console.error("Invalid provider or missing code");
    return Response.json({ msg: "Invalid provider or missing code" }, {
      status: 400,
    });
  }

  try {
    const userId = user.id;
    let tokens;

    switch (provider as ProviderName) {
      case "strava":
        tokens = await exchangeStravaToken(code);
        break;
      case "spotify":
        tokens = await exchangeSpotifyToken(code);
        break;
      default:
        return Response.json({ msg: "Unsupported provider" }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from(PROVIDERS[provider as ProviderName].table)
      .upsert(
        {
          user_id: userId,
          ...tokens,
        },
        { onConflict: "user_id" },
      );

    if (dbError) {
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    console.log(`Stored ${provider} tokens in database for user`, userId);

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

if (import.meta.main) {
  Deno.serve(exchangeHandler);
}

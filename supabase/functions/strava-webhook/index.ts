// Setup type definitions for built-in Supabase Runtime APIs
import "edge-runtime";
import { fetchStravaActivity } from "./handlers/strava.ts";
import { fetchSongsForActivity } from "./handlers/spotify.ts";
import { supabaseAdmin } from "@/shared/supabaseAdmin.ts";
interface StravaWebhookPayload {
  object_type: "activity";
  object_id: number;
  aspect_type: "create" | "update" | "delete";
  owner_id: number;
  updates?: Record<string, unknown>;
  subscription_id?: number;
  event_time?: number;
}

const VERIFY_TOKEN = Deno.env.get("STRAVA_VERIFY_TOKEN")!;

Deno.serve(async (req) => {
  if (req.method === "GET") {
    return handleSubscriptionValidation(req);
  }

  if (req.method === "POST") {
    return await handleWebhookEvent(req);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
});

// Handle Strava subscription validation challenge (ONE TIME ONLY)
function handleSubscriptionValidation(req: Request): Response {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const challenge = url.searchParams.get("hub.challenge");
  const token = url.searchParams.get("hub.verify_token");

  if (mode !== "subscribe" || !challenge) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (token !== VERIFY_TOKEN) {
    console.warn("Invalid verify token");
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  console.log("Subscription validated");
  return Response.json({ "hub.challenge": challenge });
}

async function handleWebhookEvent(req: Request): Promise<Response> {
  let payload: StravaWebhookPayload;
  try {
    payload = await req.json();
    if (!isValidWebhookPayload(payload)) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    payload.aspect_type === "create" || payload.aspect_type === "update"
  ) {
    // Perform async processing here, return success response immediately
    // EdgeRuntime.waitUntil(processActivity(payload));

    // Perform synchronous processing for testing/logging locally
    await processActivity(payload);
  } else if (payload.aspect_type === "delete") {
    // EdgeRuntime.waitUntil(deleteActivityFromDatabase(payload));
    await deleteActivityFromDatabase(payload);
    return Response.json({ received: true });
  }

  return Response.json({ received: true });
}

function isValidWebhookPayload(data: unknown): data is StravaWebhookPayload {
  if (typeof data !== "object" || data === null) return false;
  const p = data as Record<string, unknown>;
  return (
    p.object_type === "activity" &&
    typeof p.object_id === "number" &&
    ["create", "update", "delete"].includes(p.aspect_type as string) &&
    typeof p.owner_id === "number"
  );
}

async function processActivity(payload: StravaWebhookPayload) {
  const { object_id: activityId, owner_id: athleteId } = payload;

  try {
    const userId = await resolveUserIdFromStravaOwnerId(athleteId);
    // Fetch activity details from Strava and upsert into database
    const activity = await fetchStravaActivity(activityId, userId);
    // Fetch songs from Spotify and upsert into database (including join table)
    await fetchSongsForActivity(activity, userId);

    console.log("Successfully processed activity", { activityId });
  } catch (error) {
    console.error("Failed to process activity", { activityId, error });
  }
}

async function deleteActivityFromDatabase(payload: StravaWebhookPayload) {
  // TODO: Delete activity from database
}

async function resolveUserIdFromStravaOwnerId(
  ownerId: number,
): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("strava_tokens")
    .select("user_id")
    .eq("athlete_id", ownerId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to resolve user for athlete ${ownerId}`, {
      cause: error,
    });
  }

  return data.user_id;
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54381/functions/v1/strava-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODU0NTc2NjB9.THtwf1j0dXM0F0t5Fzs8c4U8cDDaED1TqwkzqIeH_8_xiZdxjN_jRf2g2kDtyRJ_JrkiRynp-zJ_Ds4kZQzyEg' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

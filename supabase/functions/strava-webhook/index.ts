// Setup type definitions for built-in Supabase Runtime APIs
import "edge-runtime";
import {
  fetchStravaActivity,
  getUserIdByAthleteId,
} from "./handlers/strava.ts";
import { fetchSongsForActivity } from "./handlers/spotify.ts";
import { supabaseAdmin } from "@/shared/supabaseAdmin.ts";

interface StravaWebhookPayload {
  object_type: "activity" | "athlete";
  object_id: number;
  aspect_type: "create" | "update" | "delete";
  owner_id: number;
  updates?: {
    authorized?: "false" | string;
    [key: string]: unknown;
  };
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

/**
 * Handle Strava subscription validation challenge (ONE TIME ONLY)
 */
function handleSubscriptionValidation(req: Request): Response {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const challenge = url.searchParams.get("hub.challenge");
  const token = url.searchParams.get("hub.verify_token");

  if (mode !== "subscribe" || !challenge) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (token !== VERIFY_TOKEN) {
    console.warn(
      "Invalid verify token received during subscription validation",
    );
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  console.log("Strava subscription validated successfully");
  return Response.json({ "hub.challenge": challenge });
}

/**
 * Handle Strava webhook POST events
 */
async function handleWebhookEvent(req: Request): Promise<Response> {
  let payload: StravaWebhookPayload;
  try {
    payload = await req.json();
  } catch (error) {
    console.error("Failed to parse webhook JSON", error);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidWebhookPayload(payload)) {
    console.warn("Received invalid webhook payload", payload);
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Handle Deauthorization
  if (
    payload.aspect_type === "update" &&
    payload.updates?.authorized === "false"
  ) {
    console.log("Handling deauthorization for athlete", payload.owner_id);
    EdgeRuntime.waitUntil(handleDeauthorization(payload));
    return Response.json({ received: true });
  }

  // Handle Activity Events
  if (payload.object_type === "activity") {
    if (payload.aspect_type === "create" || payload.aspect_type === "update") {
      EdgeRuntime.waitUntil(processActivity(payload));
    } else if (payload.aspect_type === "delete") {
      EdgeRuntime.waitUntil(deleteActivityFromDatabase(payload));
    }
  }

  return Response.json({ received: true });
}

function isValidWebhookPayload(data: StravaWebhookPayload) {
  return (
    typeof data === "object" &&
    data !== null &&
    (data.object_type === "activity" || data.object_type === "athlete") &&
    typeof data.object_id === "number" &&
    ["create", "update", "delete"].includes(data.aspect_type) &&
    typeof data.owner_id === "number"
  );
}

async function processActivity(payload: StravaWebhookPayload) {
  const { object_id: activityId, owner_id: athleteId } = payload;

  try {
    const userId = await getUserIdByAthleteId(athleteId);

    // Fetch activity details from Strava and upsert into database
    const activity = await fetchStravaActivity(activityId, userId);

    // Fetch songs from Spotify and upsert into database (including join table)
    await fetchSongsForActivity(activity, userId);

    console.log("Successfully processed activity", { activityId, userId });
  } catch (error) {
    console.error("Failed to process activity", {
      activityId,
      athleteId,
      error: error instanceof Error ? error.message : error,
    });
  }
}

async function handleDeauthorization(payload: StravaWebhookPayload) {
  const { owner_id: athleteId } = payload;

  const { error } = await supabaseAdmin
    .from("strava_tokens")
    .delete()
    .eq("athlete_id", athleteId);

  if (error) {
    console.error("Failed to handle deauthorization", { athleteId, error });
    return;
  }

  console.log("Successfully deauthorized athlete", { athleteId });
}

async function deleteActivityFromDatabase(payload: StravaWebhookPayload) {
  const { object_id: activityId } = payload;

  const { error } = await supabaseAdmin
    .from("activities")
    .delete()
    .eq("activity_id", activityId);

  if (error) {
    console.error("Failed to delete activity from database", {
      activityId,
      error,
    });
    return;
  }

  console.log("Successfully deleted activity from database", { activityId });
}

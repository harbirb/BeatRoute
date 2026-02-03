// Setup type definitions for built-in Supabase Runtime APIs
import "edge-runtime";

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

// Handle Strava subscription validation challenge
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

// Handle Strava webhook events for activities
async function handleWebhookEvent(req: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidWebhookPayload(payload)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Log event for async processing
  console.log(
    `Activity ${payload.aspect_type}: id=${payload.object_id}, owner=${payload.owner_id}`,
  );

  // TODO: Queue activity for processing (fetch details, match songs, store)

  // Acknowledge immediately (process async)
  return Response.json({ received: true });
}

function isValidWebhookPayload(data: unknown): data is StravaWebhookPayload {
  if (typeof data !== "object" || !data) return false;
  const p = data as Record<string, unknown>;
  return (
    p.object_type === "activity" &&
    typeof p.object_id === "number" &&
    (p.aspect_type === "create" || p.aspect_type === "update" ||
      p.aspect_type === "delete") &&
    typeof p.owner_id === "number"
  );
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54381/functions/v1/strava-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODU0NTc2NjB9.THtwf1j0dXM0F0t5Fzs8c4U8cDDaED1TqwkzqIeH_8_xiZdxjN_jRf2g2kDtyRJ_JrkiRynp-zJ_Ds4kZQzyEg' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

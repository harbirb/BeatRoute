// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getTokens } from "../_shared/get-tokens.ts";

const footer = "\n - Moovit.com";

Deno.serve(async (req) => {
  const { message, activity_id } = await req.json();
  const activityDescription = message + footer;
  // console.log(activityDescription);

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // get user
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const { data: userData, error: authError } =
    await supabaseClient.auth.getUser(token);
  if (authError || !userData?.user)
    return jsonResponse(401, { error: "Unauthorized" });

  const userId = userData.user.id;

  // get strava token
  const stravaToken = await getTokens(userId, "strava");

  const response = await fetch(
    `https://www.strava.com/api/v3/activities/${activity_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${stravaToken}`,
      },
      body: JSON.stringify({ description: activityDescription }),
    }
  );

  if (!response.ok) {
    console.error(response);
    return jsonResponse(500, { error: "Failed to update activity" });
  }

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});

function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

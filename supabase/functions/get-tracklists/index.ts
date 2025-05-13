// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getTokens } from "../_shared/get-tokens.ts";
import { start } from "node:repl";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // get user
  const { data: userData, error: authError } =
    await supabaseClient.auth.getUser(token);
  if (authError || !userData?.user)
    return jsonResponse(401, { error: "Unauthorized" });

  const userId = userData.user.id;
  // const stravaToken = await getTokens(userId, "strava");
  // const spotifyToken = await getTokens(userId, "spotify");

  // if (!stravaToken || !spotifyToken) {
  //   console.log("strava token", stravaToken, "spotify token", spotifyToken);
  //   return jsonResponse(401, { error: "Failed to get a token" });
  // }

  // get recent activity
  const activityData = await getRecentActivities(userId);
  const tracklistPromises = activityData.map(async (activity: any) => {
    const {
      name,
      distance,
      start_date_local,
      elapsed_time,
      id: activity_id,
    } = activity;
    const tracklist = await getTracklist(
      activity_id,
      start_date_local,
      elapsed_time,
      userId
    );
    return { name, distance, start_date_local, tracklist, activity_id };
  });
  const tracklists = await Promise.all(tracklistPromises);
  console.log(tracklists);

  return new Response(JSON.stringify(tracklists), {
    headers: { "Content-Type": "application/json" },
  });
});

function getTracklist(
  activity_id: number,
  start_date_local: string,
  elapsed_time: number,
  userId: string
) {
  // check db to see if it exists
  // otherwise, generate it and then save it in db
  // generateTracklist(start_date_local, elapsed_time, userId);
  // 3 tables, activities, tracklists, and activity_tracklists
  // activity_tracklists has activity_id and tracklist_id foreign keys to activities and tracklists
}

function generateTracklist(
  start_date_local: string,
  elapsed_time: number,
  userId: string
) {
  // logic to generate tracklist based on activity time and duration
}

function jsonResponse(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getRecentActivities(userId: string) {
  const stravaToken = await getTokens(userId, "strava");
  const NOW = Date.now() / 1000;
  const WEEKS_AGO = NOW - 100 * 24 * 60 * 60;
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?before=${NOW}&after=${WEEKS_AGO}&per_page=5`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stravaToken}`,
      },
    }
  );
  const activityData = await response.json();
  if (!activityData) return jsonResponse(400, { error: "No activity data" });
  return activityData;
}

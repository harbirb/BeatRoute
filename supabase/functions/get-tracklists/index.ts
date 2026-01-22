// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getTokens } from "../_shared/get-tokens.ts";
import { start } from "node:repl";

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

Deno.serve(async (req) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  // get user
  const { data: userData, error: authError } =
    await supabaseClient.auth.getUser(token);
  if (authError || !userData?.user)
    return jsonResponse(401, { error: "Unauthorized" });

  const userId = userData.user.id;
  const stravaToken = await getTokens(userId, "strava");
  const spotifyToken = await getTokens(userId, "spotify");

  if (!stravaToken || !spotifyToken) {
    console.log("strava token", stravaToken, "spotify token", spotifyToken);
    return jsonResponse(401, { error: "Failed to get a token" });
  }

  // get recent activity
  const activityData = await getRecentActivities(userId);
  const tracklistPromises = activityData.map(async (activity: any) => {
    const { name, distance, start_date, id: activity_id } = activity;
    const tracklist = await getTracklist(activity, userId);
    return { name, distance, start_date, tracklist, activity_id };
  });
  const tracklists = await Promise.all(tracklistPromises);
  // console.log(tracklists);

  return new Response(JSON.stringify(tracklists), {
    headers: { "Content-Type": "application/json" },
  });
});

async function getTracklist(activity: any, userId: string) {
  // check db to see if it exists
  // otherwise, generate it and then save it in db
  const { start_date, elapsed_time, id: activity_id } = activity;
  const { data, error } = await supabaseClient
    .from("tracklists")
    .select("*")
    .eq("activity_id", activity_id)
    .single();
  if (data) {
    return data.tracklist;
  }
  const tracklist = await generateTracklist(start_date, elapsed_time, userId);
  const { error: insertError } = await supabaseClient
    .from("tracklists")
    .insert({
      name: activity.name,
      distance: activity.distance,
      start_date: activity.start_date,
      activity_id,
      tracklist,
    });
  if (insertError) {
    console.error(insertError);
    return null;
  }
  return tracklist;
}

async function generateTracklist(
  start_date: string,
  elapsed_time: number,
  userId: string
) {
  const startTime = new Date(start_date).getTime();
  const endTime = startTime + elapsed_time * 1000;
  const songsAfterStart = await fetchSongsByCutoffTime(
    `after=${startTime}`,
    userId
  );
  const songsBeforeEnd = await fetchSongsByCutoffTime(
    `before=${endTime}`,
    userId
  );
  const songSet = new Set(
    songsBeforeEnd.items.map((obj: any) => {
      return obj.played_at;
    })
  );
  const songsDuringActivity = songsAfterStart.items.filter((obj: any) => {
    return songSet.has(obj.played_at);
  });
  const tracklist = songsDuringActivity.map((obj: any) => {
    return {
      track_name: obj.track.name,
      track_artists: obj.track.artists.map((artist: any) => artist.name),
      link: obj.track.external_urls.spotify,
      img: obj.track.album.images[0].url,
      uri: obj.track.uri,
      played_at: obj.played_at,
    };
  });
  tracklist.reverse();
  return tracklist;
}

// cutofftime specifies before OR after a certain time
// ex. "before=12345678"
async function fetchSongsByCutoffTime(cutoffTime: string, userId: string) {
  const spotifyToken = await getTokens(userId, "spotify");
  const recentlyPlayedSongs = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=50&${cutoffTime}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    }
  );
  if (!recentlyPlayedSongs.ok)
    return jsonResponse(400, { error: "Failed to get recently played songs" });
  return await recentlyPlayedSongs.json();
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

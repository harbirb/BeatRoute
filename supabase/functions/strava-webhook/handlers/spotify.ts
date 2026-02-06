import type { StravaDetailedActivity } from "@/shared/stravaTypes.ts";
import { SpotifyApi } from "spotify-sdk";
import { getToken } from "@/shared/tokens.ts";

export async function fetchSongsForActivity(
  activity: StravaDetailedActivity,
  userId: string,
): Promise<void> {
  const { startTimeMs, endTimeMs } = getActivityStartEndTimes(activity);
  const sdk = await createSpotifyClient(userId);
  const songs = await getSongsDuringActivity(sdk, startTimeMs, endTimeMs);

  console.log("Fetching songs for activity", {
    activityId: activity.id,
    foundSongs: songs.length,
  });

  // TODO: Upsert songs into `songs` table (idempotent on Spotify ID)
  // TODO: Upsert join rows into `songs_on_activities`
}

async function createSpotifyClient(userId: string): Promise<SpotifyApi> {
  const SPOTIFY_ACCESS_TOKEN = await getToken(userId, "spotify");
  if (!SPOTIFY_ACCESS_TOKEN) {
    throw new Error("No Spotify access token found for user");
  }

  return SpotifyApi.withAccessToken(
    Deno.env.get("SPOTIFY_CLIENT_ID")!,
    {
      access_token: SPOTIFY_ACCESS_TOKEN,
      token_type: "Bearer",
      expires_in: 3600, // Dummy value
      refresh_token: "", // Dummy value
    },
  );
}

async function getSongsDuringActivity(
  sdk: SpotifyApi,
  startTimeMs: number,
  endTimeMs: number,
) {
  // Fetch up to 50 songs played after the activity started
  const response = await sdk.player.getRecentlyPlayedTracks(50, {
    timestamp: startTimeMs,
    type: "after",
  });

  // Filter songs that were played before the activity ended
  return response.items.filter((item) => {
    const playedAtMs = new Date(item.played_at).getTime();
    return playedAtMs <= endTimeMs;
  });
}

function getActivityStartEndTimes(activity: StravaDetailedActivity) {
  if (!activity.start_date || activity.elapsed_time == null) {
    throw new Error("Activity is missing start_date or elapsed_time");
  }
  const startTimeMs = Date.parse(activity.start_date);
  const endTimeMs = startTimeMs + (activity.elapsed_time * 1000);
  return { startTimeMs, endTimeMs };
}

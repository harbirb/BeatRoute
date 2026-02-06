import type { StravaDetailedActivity } from "@/shared/stravaTypes.ts";
import { PlayHistory, SpotifyApi } from "spotify-sdk";
import { getToken } from "@/shared/tokens.ts";
import type { Database } from "@/types/supabaseTypes.ts";
import { supabaseAdmin } from "@/shared/supabaseAdmin.ts";

type SongsInsert = Database["public"]["Tables"]["songs"]["Insert"];
type SongsOnActivitiesInsert =
  Database["public"]["Tables"]["activity_songs"]["Insert"];

export async function fetchSongsForActivity(
  activity: StravaDetailedActivity,
  userId: string,
): Promise<void> {
  const { startTimeMs, endTimeMs } = getActivityStartEndTimes(activity);
  const sdk = await createSpotifyClient(userId);
  const songs = await getSongsDuringActivity(sdk, startTimeMs, endTimeMs);

  if (songs.length === 0) {
    console.log("No songs found for activity", { activityId: activity.id });
    return;
  }
  await linkSongsToActivity(songs, activity);
}

// Add songs to database and link to activity via join table
async function linkSongsToActivity(
  songs: PlayHistory[],
  activity: StravaDetailedActivity,
) {
  const songRecords = songs.map(mapToSongRecord);
  const { error: songError } = await supabaseAdmin.from("songs").upsert(
    songRecords,
    { onConflict: "id" },
  );
  if (songError) {
    console.error("Error upserting songs", songError);
    return;
  }

  const joinRecords = songs.map((song): SongsOnActivitiesInsert => ({
    activity_id: activity.id ?? 0,
    played_at: song.played_at,
    song_id: song.track.id,
  }));
  const { error: joinError } = await supabaseAdmin.from("activity_songs")
    .upsert(joinRecords, {
      onConflict: "activity_id, song_id, played_at",
    });
  if (joinError) {
    console.error("Error upserting activity_songs", joinError);
    return;
  }
}

// Map PlayHistory to SongsInsert object
function mapToSongRecord(song: PlayHistory): SongsInsert {
  return {
    id: song.track.id,
    title: song.track.name,
    artists: song.track.artists.map((artist) => artist.name),
    album_art_url: song.track.album.images[0]?.url ?? null,
    spotify_url: song.track.external_urls.spotify,
  };
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

// Fetch songs played during the activity
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

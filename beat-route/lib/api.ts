import { supabase } from "./supabase";
import { Activity, ActivitySong } from "@/context/DataContext";
import { Database } from "@/types/supabase";

// Helper to format pace (min/km)
function formatPace(seconds: number, meters: number): string {
  if (!meters || meters === 0) return "0'00/km";
  const minutesPerKm = (seconds / 60) / (meters / 1000);
  const min = Math.floor(minutesPerKm);
  const sec = Math.round((minutesPerKm - min) * 60);
  return `${min}'${sec.toString().padStart(2, "0")}"/km`;
}

export async function fetchActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("start_time", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }

  const activitiesData =
    data as Database["public"]["Tables"]["activities"]["Row"][];

  return activitiesData.map((row) => {
    const type =
      (row.activity_type?.toLowerCase() === "ride" ? "ride" : "run") as
        | "run"
        | "ride";

    // TODO: Add elevation gain and average heart rate or remove from this data type

    const base = {
      id: row.activity_id.toString(),
      name: row.name || "Untitled Activity",
      date: row.start_time || new Date().toISOString(),
      distanceInMeters: Number(row.distance_meters || 0),
      durationInSeconds: row.moving_time_seconds || 0,
      elevationGainInMeters: 0, // Placeholder until column exists
      averageHeartRate: 0, // Placeholder until column exists
      polyline: row.summary_polyline || undefined,
      tracklist: undefined, // Lists don't load songs by default
    };

    if (type === "run") {
      return {
        ...base,
        type: "run",
        pace: formatPace(base.durationInSeconds, base.distanceInMeters),
      };
    } else {
      return {
        ...base,
        type: "ride",
        averageSpeedKph: base.durationInSeconds > 0
          ? (base.distanceInMeters / 1000) / (base.durationInSeconds / 3600)
          : 0,
      };
    }
  });
}

export async function fetchActivitySongs(
  activityId: string,
): Promise<ActivitySong[]> {
  const { data, error } = await supabase
    .from("activity_songs")
    .select(`
      song_id,
      played_at,
      songs (
        id,
        title,
        artists,
        album_art_url,
        spotify_url
      )
    `)
    .eq("activity_id", Number(activityId))
    .order("played_at", { ascending: true });

  if (error) {
    console.error("Error fetching activity songs:", error);
    throw error;
  }

  // Map nested join data
  return data.map((item) => {
    const song = item.songs;

    return {
      id: song.id,
      title: song.title,
      artists: song.artists,
      spotifyUrl: song.spotify_url,
      albumArtUrl: song.album_art_url,
    };
  });
}

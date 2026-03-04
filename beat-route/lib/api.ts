import { supabase } from "./supabase";
import { Activity, ActivitySong, ActivityType } from "@/context/DataContext";
import { Database } from "@/types/supabase";

function getPace(
  type: ActivityType,
  seconds: number,
  meters: number,
): string | undefined {
  if (!["run", "walk", "hike"].includes(type)) return undefined;
  if (!meters || meters <= 0 || !seconds || seconds <= 0) return "0'00\"/km";
  const minutesPerKm = (seconds / 60) / (meters / 1000);
  const min = Math.floor(minutesPerKm);
  const sec = Math.round((minutesPerKm - min) * 60);
  return `${min}'${sec.toString().padStart(2, "0")}"/km`;
}

function getAverageSpeedKph(
  type: ActivityType,
  seconds: number,
  meters: number,
): number | undefined {
  if (type !== "ride") return undefined;
  if (!meters || meters <= 0 || !seconds || seconds <= 0) return 0;
  return Number(((meters / 1000) / (seconds / 3600)).toFixed(1));
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

  const activitiesData = data;

  return activitiesData.map((row) => {
    const type: ActivityType = getActivityType(row.activity_type);
    const durationInSeconds = row.moving_time_seconds || 0;
    const distanceInMeters = row.distance_meters || 0;

    return {
      id: row.activity_id.toString(),
      type,
      name: row.name || getDefaultActivityName(type, row.start_time),
      date: row.start_time || new Date().toISOString(),
      durationInSeconds,
      distanceInMeters,
      elevationGainInMeters: 0, // Placeholder
      averageHeartRate: 0, // Placeholder
      // Calculated fields
      pace: getPace(type, durationInSeconds, distanceInMeters),
      averageSpeedKph: getAverageSpeedKph(
        type,
        durationInSeconds,
        distanceInMeters,
      ),
      polyline: row.summary_polyline || undefined,
      startLatLng: extractStartLatLng(row.raw_data),
    };
  });
}

function extractStartLatLng(rawData: unknown): [number, number] | undefined {
  if (!rawData || typeof rawData !== "object") return undefined;
  const latlng = (rawData as Record<string, unknown>)["start_latlng"];
  if (Array.isArray(latlng) && latlng.length === 2) {
    return [latlng[0] as number, latlng[1] as number];
  }
  return undefined;
}

function getDefaultActivityName(type: ActivityType, startTime: string | null): string {
  const typeLabel: Record<ActivityType, string> = {
    run: "Run",
    ride: "Ride",
    hike: "Hike",
    walk: "Walk",
    other: "Activity",
  };

  if (!startTime) return `Morning ${typeLabel[type]}`;

  const hour = new Date(startTime).getHours();
  let timeOfDay = "Morning";
  if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
  else if (hour >= 17 && hour < 21) timeOfDay = "Evening";
  else if (hour >= 21 || hour < 5) timeOfDay = "Night";

  return `${timeOfDay} ${typeLabel[type]}`;
}

function getActivityType(activityType: string | null) {
  let type: ActivityType = "other";
  if (activityType) {
    const lowerType = activityType.toLowerCase();
    if (
      [
        "run",
        "ride",
        "hike",
        "walk",
        "other",
      ].includes(lowerType)
    ) {
      type = lowerType as ActivityType;
    }
  }
  return type;
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

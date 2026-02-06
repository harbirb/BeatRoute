import type { StravaDetailedActivity } from "@/shared/stravaTypes.ts";
import { getTokens } from "@/shared/get-tokens.ts";

export async function fetchSongsForActivity(
  activity: StravaDetailedActivity,
  userId: string,
): Promise<void> {
  const { startTimeSeconds, endTimeSeconds } = getActivityStartEndTimes(
    activity,
  );

  console.log("Fetching songs for activity", {
    activityId: activity.id,
  });

  // TODO: Use `getTokens(userId)` to fetch Spotify access token
  // TODO: Call Spotify API to fetch tracks for the time window
  // TODO: Upsert songs into `songs` table (idempotent on Spotify ID)
  // TODO: Upsert join rows into `songs_on_activities`
}

function getActivityStartEndTimes(activity: StravaDetailedActivity) {
  if (!activity.start_date || activity.elapsed_time == null) {
    throw new Error("Activity is missing start_date or elapsed_time");
  }
  const startTimeSeconds = Math.floor(Date.parse(activity.start_date) / 1000);
  const endTimeSeconds = startTimeSeconds + activity.elapsed_time;
  return { startTimeSeconds, endTimeSeconds };
}

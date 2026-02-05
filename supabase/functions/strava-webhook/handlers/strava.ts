import { getToken } from "@/shared/tokens.ts";
import type { paths } from "@/types/stravaTypes.ts";
import { supabaseAdmin } from "@/shared/supabaseAdmin.ts";
import type { Database, Json } from "@/types/supabaseTypes.ts";

type StravaDetailedActivity =
  paths["/activities/{id}"]["get"]["responses"][200]["content"][
    "application/json"
  ];

type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];

// Get summary polyline from activity map data
function getSummaryPolyline(activity: StravaDetailedActivity): string | null {
  return (
    (activity.map as { summary_polyline?: string | null } | undefined)
      ?.summary_polyline ?? null
  );
}

function toActivityInsert(
  activity: StravaDetailedActivity,
  userId: string,
): ActivityInsert {
  return {
    activity_id: activity.id ?? 0,
    user_id: userId,
    activity_type: activity.type ?? null,
    athlete_id: activity.athlete?.id ?? null,
    distance_meters: activity.distance ?? null,
    elapsed_time_seconds: activity.elapsed_time ?? null,
    moving_time_seconds: activity.moving_time ?? null,
    name: activity.name ?? null,
    start_time: activity.start_date ?? null,
    summary_polyline: getSummaryPolyline(activity),
    raw_data: activity as Json,
  };
}

export async function fetchStravaActivity(
  activityId: number,
  userId: string,
): Promise<StravaDetailedActivity> {
  // TODO: Setup tokens in DB, test with
  console.log("Fetching Strava activity", { activityId, userId });

  const accessToken = await getToken(userId, "strava");

  const res = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) {
    throw new Error(`Strava API error: ${res.status}`);
  }

  const activity: StravaDetailedActivity = await res.json();
  console.log("Successfully fetched activity", { activityId });

  await upsertActivity(activity, userId);

  return activity;
}

async function upsertActivity(
  activity: StravaDetailedActivity,
  userId: string,
) {
  if (!activity.id) {
    throw new Error("Strava activity is missing id");
  }

  const payload = toActivityInsert(activity, userId);

  const { error } = await supabaseAdmin
    .from("activities")
    .upsert(payload, { onConflict: "activity_id" });

  if (error) {
    throw new Error(`Failed to upsert activity: ${error.message}`);
  }
}

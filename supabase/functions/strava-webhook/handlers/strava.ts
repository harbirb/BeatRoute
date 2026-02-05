import { getToken } from "../../_shared/tokens.ts";
import type { paths } from "../../_shared/stravaTypes.ts";

type StravaDetailedActivity =
  paths["/activities/{id}"]["get"]["responses"][200]["content"][
    "application/json"
  ];

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
}

import { type StravaActivity } from "strava-sdk";
import { getToken } from "../../_shared/tokens.ts";

export async function fetchStravaActivity(
  activityId: number,
  userId: string,
): Promise<StravaActivity> {
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

  const activity: StravaActivity = await res.json();
  console.log("Successfully fetched activity", { activityId });
  console.log(activity);
  return activity;
}

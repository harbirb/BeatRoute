import "strava-sdk";

export async function fetchStravaActivity(
  activityId: number,
  userId: string,
): Promise<void> {
  console.log("Fetching Strava activity", { activityId, userId });
  // TODO: Use userId to fetch tokens, then fetch activity details.
}

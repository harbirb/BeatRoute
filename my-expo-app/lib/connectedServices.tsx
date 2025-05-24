import { supabase } from "./supabase";

export const isStravaConnected = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user.id);
  const { data, error } = await supabase
    .from("strava_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (data) {
    console.log(data);
    return true;
  }
  console.log(error);
  return false;
};

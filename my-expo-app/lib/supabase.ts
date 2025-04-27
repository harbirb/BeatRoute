import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import Constants from "expo-constants";

// LOCAL DEVELOPMENT SUPABASE
const supabaseUrl = "http://192.168.0.69:54381";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// REMOTE SUPABASE
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmeGJyZmZneHp2Z3p2d2R4d2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTg2NjMsImV4cCI6MjA0OTUzNDY2M30.EMqa1C3gremVWuqHVc59zv96-H1z9HnZyCrzLEhxwXY";
// const supabaseUrl = "https://rfxbrffgxzvgzvwdxwhh.supabase.co";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

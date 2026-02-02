import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuth();
  const { loading: isDataLoading } = useData();

  // Hide the splash screen once auth AND data are loaded
  if (!isLoading && !isDataLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}

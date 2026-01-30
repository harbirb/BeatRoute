import { useAuth } from "@/context/AuthContext";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuth();

  if (isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}

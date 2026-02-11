import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { SplashScreenController } from "@/components/SplashScreenController";

export const unstable_settings = {
  anchor: "index",
};

function RootNavigator() {
  const { isLoggedIn, profile, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      {/* Not logged in */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Logged in but no profile */}
      <Stack.Protected guard={isLoggedIn && !profile?.name}>
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Logged in and has profile */}
      <Stack.Protected guard={isLoggedIn && profile?.name}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile"
          options={{
            presentation: "card",
            headerShown: true,
            title: "Profile",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="stickers-modal"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="activity/[id]"
          options={{
            presentation: "card",
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
          }}
        />
      </Stack.Protected>
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <DataProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style="auto" />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
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
  const {
    isLoggedIn,
    profile,
    isLoading,
    hasSeenWelcome,
    hasSeenConnectServices,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      {/* First launch: show welcome screen */}
      <Stack.Protected guard={!hasSeenWelcome}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Has seen welcome, not logged in */}
      <Stack.Protected guard={hasSeenWelcome && !isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Logged in but hasn't completed setup (name + services step) */}
      <Stack.Protected
        guard={isLoggedIn && (!profile?.name || !hasSeenConnectServices)}
      >
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Fully onboarded */}
      <Stack.Protected
        guard={isLoggedIn && !!profile?.name && hasSeenConnectServices}
      >
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
            headerTransparent: true,
          }}
        />
      </Stack.Protected>
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

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Auth from "@/components/Auth";

import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import { Linking } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
  });
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  const handleDeepLink = (event: { url: string }) => {
    const { url } = event;
    console.log("Deep link URL:", url);
    // Handle extracting auth code here
  };

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );

    const linkingListener = Linking.addEventListener("url", handleDeepLink);
    // if cold start (app launched from link)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.unsubscribe();
      linkingListener.remove();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      {session ? (
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="photo-editor"
            options={{
              headerShown: false,
              gestureEnabled: false,
              presentation: "fullScreenModal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <Auth />
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

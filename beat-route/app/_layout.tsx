import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "@/context/DataContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <DataProvider>
        {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "card", title: "Modal" }}
          />
          <Stack.Screen
            name="activity/[id]"
            options={{
              presentation: "card",
              headerShown: true,
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </DataProvider>
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
}

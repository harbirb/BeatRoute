import React, { useEffect } from "react";
import { Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

// Complete the auth session if we're in a web browser environment
WebBrowser.maybeCompleteAuthSession();

// Strava OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
  revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

export default function StravaOAuthButton() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || "",
      scopes: ["activity:read_all"],
      redirectUri: process.env.EXPO_PUBLIC_STRAVA_REDIRECT_URI || "",
      responseType: "code",
      extraParams: {
        approval_prompt: "force",
      },
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log("Strava Authorization Code:", code);

      // Handle the code (e.g., send to your backend/Supabase function to exchange for tokens)
      Alert.alert("Success", "Strava authorized! Code: " + code);
    } else if (response?.type === "error") {
      Alert.alert(
        "Error",
        response.error?.message || "Failed to authenticate with Strava",
      );
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Connect Strava"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}

import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Replace with your Strava app credentials
const STRAVA_CLIENT_ID = "130385";
const STRAVA_REDIRECT_URI = "exp://localhost"; // Your app's redirect URI
const STRAVA_AUTHORIZATION_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

// Required for proper redirect handling in Expo
// WebBrowser.maybeCompleteAuthSession();

export default function StravaAuth({
  onAuthSuccess,
}: {
  onAuthSuccess: (token: string) => void;
}) {
  const handleStravaLogin = async () => {
    const authUrl = `${STRAVA_AUTHORIZATION_URL}?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      STRAVA_REDIRECT_URI
    )}&response_type=code&approval_prompt=auto&scope=activity:read,profile:read_all`;

    console.log("Opening URL:", authUrl);

    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      STRAVA_REDIRECT_URI
    );

    if (result.type === "success" && result.url) {
      console.log("Redirect URL:", result);
      const urlParams = new URLSearchParams(result.url.split("?")[1]);
      const code = urlParams.get("code");

      if (code) {
        console.log("Auth Code:", code);
      }
    }
  };

  return (
    <View>
      <Text>Strava Authentication</Text>
      <Button title="Sign in with Strava" onPress={() => handleStravaLogin()} />
    </View>
  );
}

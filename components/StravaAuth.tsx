import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Chip, Text } from "@rneui/themed";

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
  const [connected, SetConnected] = useState(false);
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

        // TODO: Token exchange should be handled on the backend for security

        fetch(STRAVA_TOKEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: STRAVA_CLIENT_ID,
            client_secret: "your-strava-client-secret",
            code: code,
            grant_type: "authorization_code",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token) {
              console.log("Access Token:", data.access_token);
              onAuthSuccess(data.access_token);
            } else {
              console.error("Token exchange failed:", data);
            }
          })
          .catch((err) => console.error("Token request error:", err));
      }
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      {connected ? (
        <Chip title="Connected!" type="outline" size="md"></Chip>
      ) : (
        <Chip title="Sign in with Strava" onPress={() => handleStravaLogin()} />
      )}
    </View>
  );
}

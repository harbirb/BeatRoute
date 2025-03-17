import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Chip, Text } from "@rneui/themed";
import { supabase } from "../lib/supabase";

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
        const response = await fetch(
          "https://rfxbrffgxzvgzvwdxwhh.supabase.co/functions/v1/exchange-strava-token",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${supabase.auth.session()?.access_token}`,
              "Content-Type": "application/json",
            },
            body: { code },
          }
        );
      }
    }
  };

  const testFunction = async () => {
    const session = await supabase.auth
      .getSession()
      .then(({ data }) => data.session);
    // console.log(session);
    const { data, error } = await supabase.functions.invoke("hello-world", {
      body: { name: "Functions" },
    });
    console.log(data, error);
  };

  return (
    <View style={{ alignItems: "center" }}>
      {connected ? (
        <Chip title="Connected!" type="outline" size="md"></Chip>
      ) : (
        <Chip title="Sign in with Strava" onPress={() => testFunction()} />
      )}
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import { Chip, Text } from "@rneui/themed";
import { supabase } from "../lib/supabase";

// Replace with your Strava app credentials
const STRAVA_CLIENT_ID = "130385";
const STRAVA_REDIRECT_URI = "exp://localhost"; // Your app's redirect URI
const STRAVA_AUTHORIZATION_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

export default function StravaAuth({ onAuthSuccess }) {
  const [connected, SetConnected] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      redirectUri: STRAVA_REDIRECT_URI,
      responseType: "code",
      extraParams: {
        scope: "activity:read,profile:read_all",
        approval_prompt: "force", // Forces re-authorization
        show_dialog: "true", // Forces login prompt
      },
    },
    { authorizationEndpoint: STRAVA_AUTHORIZATION_URL }
  );
  console.log("request", request);

  useEffect(() => {
    if (response?.type === "success" && response.params?.code) {
      const code = response.params.code;
      alert(code);

      // fetch(STRAVA_TOKEN_EXCHANGE_URL, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${supabase.auth.session()?.access_token}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ code }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log("Token Exchange Response:", data);
      //     if (data.access_token) {
      //       onAuthSuccess(data.access_token);
      //        (true);
      //     }
      //   })
      //   .catch((error) => console.error("Token exchange error:", error));
    }
  }, [response]);

  return (
    <View style={{ alignItems: "center" }}>
      {connected ? (
        <Chip title="Connected!" type="outline" size="md" />
      ) : (
        <Chip title="Sign in with Strava" onPress={() => promptAsync()} />
      )}
    </View>
  );
}

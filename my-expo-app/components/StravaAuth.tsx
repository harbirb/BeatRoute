import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import { Chip, Text } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";

// Replace with your Strava app credentials
const STRAVA_CLIENT_ID = "149792";
const STRAVA_REDIRECT_URI = "exp://localhost:3000"; // Your app's redirect URI
const STRAVA_AUTHORIZATION_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

export default function StravaAuth({ onAuthSuccess }) {
  const [connected, setConnected] = useState(false);

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

  useEffect(() => {
    const handleTokenExchange = async () => {
      if (response?.type !== "success" || !response.params?.code) return;

      const code = response.params.code;
      const { data, error } = await supabase.functions.invoke(
        "exchange-strava-token",
        {
          body: { code },
        }
      );

      if (error) {
        console.error("Token exchange failed:", error);
        if (error instanceof FunctionsHttpError) {
          const errorMessage = await error.context.json();
          console.log("Function returned an error", errorMessage);
        }
        return;
      }

      if (data.success) {
        console.log("Token successfully exchanged");
        setConnected(true);
        alert("Connected to Strava!");
      }
    };

    handleTokenExchange().catch((error) =>
      console.error("Token exchange error:", error)
    );
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

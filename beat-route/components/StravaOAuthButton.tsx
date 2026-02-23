import React, { useEffect, useState } from "react";
import { Button, Alert, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
  revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

type Props = {
  onConnected?: () => void;
};

export default function StravaOAuthButton({ onConnected }: Props) {
  const [loading, setLoading] = useState(false);
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
    const handleResponse = async () => {
      if (response?.type === "success") {
        const { code } = response.params;
        setLoading(true);
        try {
          const { error } = await supabase.functions.invoke(
            "exchange-oauth-token",
            { body: { provider: "strava", code } },
          );
          if (error) throw error;
          onConnected?.();
        } catch (error: any) {
          console.error("Error exchanging Strava token:", error);
          Alert.alert("Error", error.message || "Failed to connect Strava");
        } finally {
          setLoading(false);
        }
      } else if (response?.type === "error") {
        Alert.alert(
          "Error",
          response.error?.message || "Failed to authenticate with Strava",
        );
      }
    };

    handleResponse();
  }, [response]);

  if (loading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <Button
      disabled={!request || loading}
      title="Connect Strava"
      onPress={() => promptAsync()}
    />
  );
}

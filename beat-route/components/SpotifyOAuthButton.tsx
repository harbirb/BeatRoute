import React, { useEffect, useState } from "react";
import { Button, Alert, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

type Props = {
  onConnected?: () => void;
};

export default function SpotifyOAuthButton({ onConnected }: Props) {
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "",
      scopes: ["user-read-recently-played"],
      redirectUri: process.env.EXPO_PUBLIC_SPOTIFY_REDIRECT_URI || "",
      usePKCE: false,
      responseType: "code",
      extraParams: {
        show_dialog: "true",
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
            { body: { provider: "spotify", code } },
          );
          if (error) throw error;
          onConnected?.();
        } catch (error: any) {
          console.error("Error exchanging Spotify token:", error);
          Alert.alert("Error", error.message || "Failed to connect Spotify");
        } finally {
          setLoading(false);
        }
      } else if (response?.type === "error") {
        Alert.alert(
          "Error",
          response.error?.message || "Failed to authenticate with Spotify",
        );
      }
    };

    handleResponse();
  }, [response]);

  if (loading) {
    return <ActivityIndicator size="small" color="#1DB954" />;
  }

  return (
    <Button
      disabled={!request || loading}
      title="Connect Spotify"
      color="#1DB954"
      onPress={() => promptAsync({ preferEphemeralSession: true })}
    />
  );
}

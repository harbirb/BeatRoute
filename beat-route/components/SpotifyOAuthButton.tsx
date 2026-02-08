import React, { useEffect, useState } from "react";
import { Button, Alert, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import { supabase } from "@/lib/supabase";

// Complete the auth session if we're in a web browser environment
WebBrowser.maybeCompleteAuthSession();

// Spotify OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function SpotifyOAuthButton() {
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "",
      scopes: ["user-read-email", "user-read-private", "playlist-read-private"],
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
    if (request) {
      console.log("Spotify Redirect URI:", request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === "success") {
        const { code } = response.params;
        console.log("Spotify Authorization Code:", code);
        
        setLoading(true);
        try {
          const { data, error } = await supabase.functions.invoke("exchange-oauth-token", {
            body: { provider: "spotify", code },
          });

          if (error) throw error;

          Alert.alert("Success", "Spotify connected successfully!");
        } catch (error: any) {
          console.error("Error exchanging Spotify token:", error);
          Alert.alert("Error", error.message || "Failed to exchange Spotify token");
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
      color="#1DB954" // Spotify Green
      onPress={() => {
        promptAsync({ preferEphemeralSession: true });
      }}
    />
  );
}
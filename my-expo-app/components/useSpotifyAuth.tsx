import { supabase } from "@/lib/supabase";
import { useAuthRequest } from "expo-auth-session";
import React, { useCallback, useEffect, useState } from "react";
import { View, Alert, Pressable, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

// Spotify configuration
const SPOTIFY_CLIENT_ID = "fc42a335e4a747739fe8a8f8fa07c59d";
const SPOTIFY_REDIRECT_URI = "exp://localhost:3000";

// Note: Removed redundant URLs from discovery object.
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

// Renamed the component to useSpotifyAuth
export default function useSpotifyAuth() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: ["user-read-email", "user-read-private", "playlist-read-private"],
      redirectUri: SPOTIFY_REDIRECT_URI,
      usePKCE: false,
      extraParams: {
        show_dialog: "true",
      },
    },
    discovery
  );

  useEffect(() => {
    const handleTokenExchange = async () => {
      if (response?.type !== "success" || !response.params?.code) return;

      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "exchange-spotify-token",
          { body: { code: response.params.code } }
        );

        if (error) throw error;

        if (data?.success) {
          setConnected(true);
        } else {
          throw new Error("Token exchange failed");
        }
      } catch (error) {
        console.error("Token exchange failed:", error);
        // Error handling should be moved to the parent component
      } finally {
        setLoading(false);
      }
    };

    handleTokenExchange();
  }, [response]);

  // Wrapped promptAsync in useCallback
  const connectSpotify = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  // Changed the return statement to return state and a function
  return { connected, connectSpotify, loading };
}

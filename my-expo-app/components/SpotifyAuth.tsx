import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { Chip } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

// Spotify configuration
const SPOTIFY_CLIENT_ID = "fc42a335e4a747739fe8a8f8fa07c59d"; // Replace with your Spotify Client ID
const SPOTIFY_REDIRECT_URI = "exp://localhost:3000";
const SPOTIFY_AUTHORIZATION_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export default function SpotifyAuth({ onAuthSuccess }) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      // TODO: what scopes are required?
      // Delete unused ones
      scopes: ["user-read-email", "user-read-private", "playlist-read-private"],
      redirectUri: SPOTIFY_REDIRECT_URI,
      responseType: "code",
    },
    { authorizationEndpoint: SPOTIFY_AUTHORIZATION_URL }
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
          Alert.alert("Success", "Connected to Spotify!");
        } else {
          throw new Error("Token exchange failed");
        }
      } catch (error) {
        // print to console
        console.error("Token exchange failed:", error);

        if (error) {
          const errorMessage = await error.context.json();
          console.log(errorMessage);
        } else {
          alert("Error", error);
        }
      } finally {
        setLoading(false);
      }
    };

    handleTokenExchange();
  }, [response]);

  return (
    <View style={{ alignItems: "center" }}>
      {connected ? (
        <Chip title="Connected!" type="outline" size="md" />
      ) : (
        <Chip title="Sign in with Spotify" onPress={() => promptAsync()} />
      )}
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { Chip } from "@rneui/themed";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

// Spotify configuration
const SPOTIFY_CLIENT_ID = "fc42a335e4a747739fe8a8f8fa07c59d"; // Replace with your Spotify Client ID
const SPOTIFY_REDIRECT_URI = "exp://localhost";
const SPOTIFY_AUTHORIZATION_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const discovery = {
  authorizationEndpoint: SPOTIFY_AUTHORIZATION_URL,
  tokenEndpoint: SPOTIFY_TOKEN_URL,
} as const;

export default function SpotifyAuth({
  onAuthSuccess,
}: {
  onAuthSuccess: (token: string) => void;
}) {
  const [connected, setConnected] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: ["user-read-email", "user-read-private", "playlist-read-private"],
      redirectUri: SPOTIFY_REDIRECT_URI,
      responseType: "code" as ResponseType,
      usePKCE: true, // Proof Key for Code Exchange for added security
    },
    discovery
  );
  console.log("Redirect URI:", SPOTIFY_REDIRECT_URI);

  console.log("Request:", request);
  console.log("Response:", response);

  // Handle the authentication response
  useEffect(() => {
    console.log(response);
    if (response?.type === "success") {
      WebBrowser.dismissBrowser();
      const { code } = response.params;
      console.log("Auth Code:", code);

      // Exchange code for access token
      fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: "YOUR_SPOTIFY_CLIENT_SECRET", // Replace with your Spotify Client Secret
          code,
          grant_type: "authorization_code",
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }).toString(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            console.log("Access Token:", data.access_token);
            setConnected(true);
            onAuthSuccess(data.access_token);
          } else {
            console.error("Token exchange failed:", data);
          }
        })
        .catch((err) => console.error("Token request error:", err));
    } else if (response?.type === "error") {
      console.error("Auth error:", response);
    } else if (response?.type === "cancel") {
      WebBrowser.dismissBrowser();
      console.log("Auth canceled");
    }
  }, [response]);

  const handleSpotifyLogin = async (): Promise<void> => {
    try {
      const result = await promptAsync();
      console.log("Auth result:", result);
    } catch (error) {
      console.error("Spotify auth error:", error);
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      {connected ? (
        <Chip title="Connected!" type="outline" size="md" />
      ) : (
        <Chip
          title="Sign in with Spotify"
          onPress={handleSpotifyLogin}
          disabled={!request} // Disable until the auth request is ready
        />
      )}
    </View>
  );
}

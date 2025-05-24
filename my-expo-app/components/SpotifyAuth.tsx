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
import * as Crypto from "expo-crypto";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

// Spotify configuration
const SPOTIFY_CLIENT_ID = "fc42a335e4a747739fe8a8f8fa07c59d";
const SPOTIFY_REDIRECT_URI = "exp://localhost:3000";
const SPOTIFY_AUTHORIZATION_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function SpotifyAuth({}) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      // TODO: what scopes are required?
      // Delete unused ones
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
      console.log(response);
      console.log(response?.type, response?.params);
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

const generatePKCE = async () => {
  const codeVerifier = generateRandomString(128); // Random string
  const codeChallenge = await generateCodeChallenge(codeVerifier); // Hash it to get the challenge
  return { codeVerifier, codeChallenge };
};

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Code challenge generation using SHA256
const generateCodeChallenge = async (codeVerifier) => {
  const buffer = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return buffer.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // Spotify uses Base64 URL Encoding
};

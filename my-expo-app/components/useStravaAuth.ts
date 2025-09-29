import React, { useCallback, useEffect, useState } from "react";
import { View, Alert, Pressable, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session";
import { supabase } from "../lib/supabase";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";

// Dev credentials
// const STRAVA_CLIENT_ID = "149792";
// const STRAVA_REDIRECT_URI = "exp://localhost:3000";

// Prod credentials
const STRAVA_CLIENT_ID = "130385";
const STRAVA_REDIRECT_URI = "exp://moovit.onrender.com";

const STRAVA_AUTHORIZATION_URL = "https://www.strava.com/oauth/authorize";

// Required for proper redirect handling in Expo
WebBrowser.maybeCompleteAuthSession();

const checkStravaConnection = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("strava_tokens")
    .select("user_id") 
    .eq("user_id", user.id)
    .maybeSingle();

  return !!data;
};

export default function StravaAuth() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      const isConnected = await checkStravaConnection();
      setConnected(isConnected);
      setLoading(false);
    };
    fetchConnectionStatus();
  }, []);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      redirectUri: STRAVA_REDIRECT_URI,
      responseType: "code",
      extraParams: {
        scope: "activity:read_all,profile:read_all,activity:write",
        approval_prompt: "force", // Forces re-authorization
        show_dialog: "true", // Forces login prompt
      },
    },
    { authorizationEndpoint: STRAVA_AUTHORIZATION_URL }
  );

  useEffect(() => {
    const handleTokenExchange = async () => {
      if (response?.type !== "success" || !response.params?.code) return;

      setLoading(true);
      const { data, error } = await supabase.functions.invoke(
        "exchange-strava-token",
        { body: { code: response.params.code } }
      );

      // console.log(data);
      // console.log(error);

      if (error instanceof FunctionsHttpError) {
        console.log(await error.context.json());
      }

      if (data) {
        setConnected(true);
        // console.log(connected);
        // console.log(data);
      }

      setLoading(false);
    };

    handleTokenExchange();
  }, [response]);

  const connectStrava = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  return { connected, connectStrava };
}

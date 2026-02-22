import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { Session } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

const WELCOME_SEEN_KEY = "has_seen_welcome";
const CONNECT_SERVICES_SEEN_KEY = "has_seen_connect_services";

// Define the shape of auth context data
export type AuthData = {
  session?: Session | null;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isStravaConnected: boolean;
  isSpotifyConnected: boolean;
  hasSeenWelcome: boolean;
  hasSeenConnectServices: boolean;
  refetchProfile: () => Promise<void>;
  refetchConnectedServices: () => Promise<void>;
  markWelcomeSeen: () => Promise<void>;
  markConnectServicesSeen: () => Promise<void>;
};

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  isStravaConnected: false,
  isSpotifyConnected: false,
  hasSeenWelcome: false,
  hasSeenConnectServices: false,
  refetchProfile: async () => {},
  refetchConnectedServices: async () => {},
  markWelcomeSeen: async () => {},
  markConnectServicesSeen: async () => {},
});

// Create the AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | undefined | null>(undefined);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [hasSeenConnectServices, setHasSeenConnectServices] = useState(false);

  // Fetch session on app startup
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);

      // Read onboarding flags from SecureStore in parallel with session fetch
      const [{ data: sessionData, error }, welcomeSeen, connectSeen] =
        await Promise.all([
          supabase.auth.getSession(),
          SecureStore.getItemAsync(WELCOME_SEEN_KEY),
          SecureStore.getItemAsync(CONNECT_SERVICES_SEEN_KEY),
        ]);

      if (error) {
        console.error("Error fetching session:", error);
      }

      const currentSession = sessionData?.session ?? null;

      // Existing logged-in users should bypass the welcome screen
      const effectiveWelcomeSeen =
        welcomeSeen === "true" || !!currentSession;
      if (!!currentSession && welcomeSeen !== "true") {
        await SecureStore.setItemAsync(WELCOME_SEEN_KEY, "true");
      }

      setHasSeenWelcome(effectiveWelcomeSeen);
      setHasSeenConnectServices(connectSeen === "true");
      setSession(currentSession);
      setIsLoading(false);
    };

    fetchSession();

    // Subscribe for auth state changes (ex. sign-in, sign-out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile and connected services whenever the session changes
  useEffect(() => {
    const fetchProfileAndServices = async () => {
      setIsLoading(true);

      if (session) {
        const [profileRes, stravaRes, spotifyRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single(),
          supabase
            .from("strava_tokens")
            .select("user_id")
            .eq("user_id", session.user.id)
            .single(),
          supabase
            .from("spotify_tokens")
            .select("user_id")
            .eq("user_id", session.user.id)
            .single(),
        ]);
        setProfile(profileRes.data);
        setIsStravaConnected(!!stravaRes.data);
        setIsSpotifyConnected(!!spotifyRes.data);

        // Existing users who already have a name should bypass the setup screen
        if (profileRes.data?.name) {
          const connectSeen = await SecureStore.getItemAsync(
            CONNECT_SERVICES_SEEN_KEY
          );
          if (connectSeen !== "true") {
            await SecureStore.setItemAsync(CONNECT_SERVICES_SEEN_KEY, "true");
            setHasSeenConnectServices(true);
          }
        }
      } else {
        setProfile(null);
        setIsStravaConnected(false);
        setIsSpotifyConnected(false);
      }
      setIsLoading(false);
    };

    fetchProfileAndServices();
  }, [session]);

  const refetchProfile = async () => {
    if (session) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
    }
  };

  const refetchConnectedServices = async () => {
    if (!session) return;
    const [stravaRes, spotifyRes] = await Promise.all([
      supabase
        .from("strava_tokens")
        .select("user_id")
        .eq("user_id", session.user.id)
        .single(),
      supabase
        .from("spotify_tokens")
        .select("user_id")
        .eq("user_id", session.user.id)
        .single(),
    ]);
    setIsStravaConnected(!!stravaRes.data);
    setIsSpotifyConnected(!!spotifyRes.data);
  };

  const markWelcomeSeen = async () => {
    await SecureStore.setItemAsync(WELCOME_SEEN_KEY, "true");
    setHasSeenWelcome(true);
  };

  const markConnectServicesSeen = async () => {
    await SecureStore.setItemAsync(CONNECT_SERVICES_SEEN_KEY, "true");
    setHasSeenConnectServices(true);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        isLoading,
        isLoggedIn: !!session,
        isStravaConnected,
        isSpotifyConnected,
        hasSeenWelcome,
        hasSeenConnectServices,
        refetchProfile,
        refetchConnectedServices,
        markWelcomeSeen,
        markConnectServicesSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

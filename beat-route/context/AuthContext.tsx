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
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const WELCOME_SEEN_KEY = "has_seen_welcome";
const CONNECT_SERVICES_SEEN_KEY = "has_seen_connect_services";

export type AuthData = {
  session?: Session | null;
  profile?: Profile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasSeenWelcome: boolean;
  hasSeenConnectServices: boolean;
  refetchProfile: () => Promise<void>;
  markWelcomeSeen: () => Promise<void>;
  markConnectServicesSeen: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  hasSeenWelcome: false,
  hasSeenConnectServices: false,
  refetchProfile: async () => {},
  markWelcomeSeen: async () => {},
  markConnectServicesSeen: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | undefined | null>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [hasSeenConnectServices, setHasSeenConnectServices] = useState(false);

  // Fetch session on app startup
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);

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
      const effectiveWelcomeSeen = welcomeSeen === "true" || !!currentSession;
      if (!!currentSession && welcomeSeen !== "true") {
        await SecureStore.setItemAsync(WELCOME_SEEN_KEY, "true");
      }

      setHasSeenWelcome(effectiveWelcomeSeen);
      setHasSeenConnectServices(connectSeen === "true");
      setSession(currentSession);
      setIsLoading(false);
    };

    fetchSession();

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

  // Fetch profile whenever the session changes
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(data);

        // Existing users who already have a name should bypass the setup screen
        if (data?.name) {
          const connectSeen = await SecureStore.getItemAsync(
            CONNECT_SERVICES_SEEN_KEY,
          );
          if (connectSeen !== "true") {
            await SecureStore.setItemAsync(CONNECT_SERVICES_SEEN_KEY, "true");
            setHasSeenConnectServices(true);
          }
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [session]);

  const refetchProfile = async () => {
    if (!session) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setProfile(data);
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
        hasSeenWelcome,
        hasSeenConnectServices,
        refetchProfile,
        markWelcomeSeen,
        markConnectServicesSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

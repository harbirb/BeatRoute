import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import StravaOAuthButton from "@/components/StravaOAuthButton";
import SpotifyOAuthButton from "@/components/SpotifyOAuthButton";
import {
  Colors,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
} from "@/constants/theme";

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { profile, session, refetchProfile } = useAuth();

  const stravaConnected = !!profile?.strava_connected;
  const spotifyConnected = !!profile?.spotify_connected;

  async function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) console.error("Error signing out:", error.message);
        },
      },
    ]);
  }

  const cardBackground = colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Welcome header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
          <Text style={styles.avatarText}>{getInitials(profile?.name)}</Text>
        </View>
        <Text style={[styles.welcome, { color: theme.text }]}>
          Welcome, {profile?.name}
        </Text>
        <Text style={[styles.email, { color: theme.icon }]}>
          {session?.user.email}
        </Text>
      </View>

      {/* Connected services */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.icon }]}>
          CONNECTED SERVICES
        </Text>

        {/* Strava */}
        <View
          style={[
            styles.serviceCard,
            {
              borderColor: stravaConnected ? theme.tint : theme.icon,
              backgroundColor: cardBackground,
            },
          ]}
        >
          <View style={styles.serviceHeader}>
            <Text style={[styles.serviceName, { color: theme.text }]}>
              Strava
            </Text>
            {stravaConnected ? (
              <View style={styles.connectedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.tint}
                />
                <Text style={[styles.connectedText, { color: theme.tint }]}>
                  Connected
                </Text>
              </View>
            ) : (
              <Text style={[styles.notConnectedText, { color: theme.icon }]}>
                Not connected
              </Text>
            )}
          </View>
          <Text style={[styles.serviceDescription, { color: theme.icon }]}>
            {stravaConnected
              ? "Your workouts are syncing."
              : "Connect to import your workout activities."}
          </Text>
          {!stravaConnected && (
            <View style={styles.buttonWrapper}>
              <StravaOAuthButton />
            </View>
          )}
        </View>

        {/* Spotify */}
        <View
          style={[
            styles.serviceCard,
            {
              borderColor: spotifyConnected ? theme.tint : theme.icon,
              backgroundColor: cardBackground,
            },
          ]}
        >
          <View style={styles.serviceHeader}>
            <Text style={[styles.serviceName, { color: theme.text }]}>
              Spotify
            </Text>
            {spotifyConnected ? (
              <View style={styles.connectedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.tint}
                />
                <Text style={[styles.connectedText, { color: theme.tint }]}>
                  Connected
                </Text>
              </View>
            ) : (
              <Text style={[styles.notConnectedText, { color: theme.icon }]}>
                Not connected
              </Text>
            )}
          </View>
          <Text style={[styles.serviceDescription, { color: theme.icon }]}>
            {spotifyConnected
              ? "Songs are being matched to your workouts."
              : "Connect to see your workout soundtrack."}
          </Text>
          {!spotifyConnected && (
            <View style={styles.buttonWrapper}>
              <SpotifyOAuthButton />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refetchProfile}
        >
          <Text style={[styles.refreshText, { color: theme.tint }]}>
            Check again
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign out */}
      <TouchableOpacity
        style={[styles.signOutButton, { borderColor: "#ff3b30" }]}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.large,
    gap: SPACING.large,
    paddingBottom: SPACING.large * 2,
  },
  header: {
    alignItems: "center",
    gap: SPACING.small,
    paddingVertical: SPACING.large,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.small,
  },
  avatarText: {
    color: "#fff",
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
  },
  welcome: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
  },
  email: {
    fontSize: FONT_SIZE.medium,
  },
  section: {
    gap: SPACING.small,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.8,
    marginBottom: SPACING.xsmall,
  },
  serviceCard: {
    borderWidth: 1,
    borderRadius: RADIUS.large,
    padding: SPACING.medium,
    gap: SPACING.small,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: FONT_SIZE.large,
    fontWeight: FONT_WEIGHT.bold,
  },
  serviceDescription: {
    fontSize: FONT_SIZE.small,
    lineHeight: 20,
  },
  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  connectedText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
  },
  notConnectedText: {
    fontSize: FONT_SIZE.small,
  },
  buttonWrapper: {
    marginTop: SPACING.xsmall,
  },
  refreshButton: {
    alignSelf: "center",
    padding: SPACING.small,
    marginTop: SPACING.xsmall,
  },
  refreshText: {
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.medium,
  },
  signOutButton: {
    borderWidth: 1,
    borderRadius: RADIUS.medium,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.small,
  },
  signOutText: {
    color: "#ff3b30",
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.medium,
  },
});

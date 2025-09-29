import {
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/lib/supabase";
import useStravaAuth from "@/components/useStravaAuth";
import useSpotifyAuth from "@/components/useSpotifyAuth";

export default function Settings() {
  const { connected: isStravaConnected, connectStrava } = useStravaAuth();
  const { connected: isSpotifyConnected, connectSpotify } = useSpotifyAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>

      <View style={styles.section}>
        <ThemedText type="subtitle">Connected Services</ThemedText>
        <View style={styles.serviceWrapper}>
          <ThemedText style={styles.serviceTitle}>Strava</ThemedText>
          <View style={styles.serviceContainer}>
            <ThemedText>Status: {isStravaConnected ? "Connected" : "Not Connected"}</ThemedText>
            <Pressable style={styles.button} onPress={() => connectStrava()}>
              <ThemedText style={styles.buttonText}>Reconnect</ThemedText>
            </Pressable>
          </View>
        </View>
        <View style={styles.serviceWrapper}>
          <ThemedText style={styles.serviceTitle}>Spotify</ThemedText>
          <View style={styles.serviceContainer}>
            <ThemedText>Status: {isSpotifyConnected ? "Connected" : "Not Connected"}</ThemedText>
            <Pressable style={styles.button} onPress={() => connectSpotify()}>
              <ThemedText style={styles.buttonText}>Reconnect</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">User</ThemedText>
        <Pressable style={styles.button} onPress={() => supabase.auth.signOut()}>
          <ThemedText style={styles.buttonText}>Sign out</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    borderRadius: 10,
  },
  serviceWrapper: {
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF5733",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  useColorScheme,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/lib/supabase";
import useStravaAuth from "@/components/useStravaAuth";
import useSpotifyAuth from "@/components/useSpotifyAuth";
import { Colors } from "@/constants/Colors";

export default function Settings() {
  const { connected: isStravaConnected, connectStrava } = useStravaAuth();
  const { connected: isSpotifyConnected, connectSpotify } = useSpotifyAuth();
  const colorScheme = useColorScheme() ?? "light";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#555",
    },
    header: {
      paddingTop: 100,
      padding: 30,
      backgroundColor: Colors[colorScheme].background,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme].icon,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: Colors[colorScheme].text,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 15,
      color: Colors[colorScheme].text,
    },
    card: {
      backgroundColor: Colors[colorScheme].background,
      borderRadius: 15,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: Colors[colorScheme].icon,
    },
    serviceContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    serviceTitle: {
      fontSize: 18,
      fontWeight: "500",
      color: Colors[colorScheme].text,
    },
    statusText: {
      fontSize: 16,
      color: isStravaConnected ? "green" : "red",
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: Colors[colorScheme].tint,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    primaryButtonText: {
      color: colorScheme === "dark" ? Colors.dark.background : "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },

  });

  return (
    <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Connected Services</ThemedText>
            <View style={styles.card}>
              <View style={styles.serviceContainer}>
                <ThemedText style={styles.serviceTitle}>Strava</ThemedText>
                <ThemedText style={styles.statusText}>
                  {isStravaConnected ? "Connected" : "Not Connected"}
                </ThemedText>
              </View>
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={() => connectStrava()}
              >
                <ThemedText style={styles.primaryButtonText}>
                  {isStravaConnected ? "Reconnect" : "Connect"}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.serviceContainer}>
                <ThemedText style={styles.serviceTitle}>Spotify</ThemedText>
                <ThemedText style={styles.statusText}>
                  {isSpotifyConnected ? "Connected" : "Not Connected"}
                </ThemedText>
              </View>
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={() => connectSpotify()}
              >
                <ThemedText style={styles.primaryButtonText}>
                  {isSpotifyConnected ? "Reconnect" : "Connect"}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>User Account</ThemedText>
            <View style={styles.card}>
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={() => supabase.auth.signOut()}
              >
                <ThemedText style={styles.primaryButtonText}>Sign Out</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
    </ThemedView>
  );
}

import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import useStravaAuth from "@/components/useStravaAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => {
  const { connected: isStravaConnected, connectStrava } = useStravaAuth();
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const status = await AsyncStorage.getItem("hasCompletedOnboarding");
      if (status === "true") {
        console.log("already onboarded");
        router.replace("/(tabs)");
      }
    };
    checkOnboardingStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitFlow</Text>
      <Text style={styles.subtitle}>
        Welcome to Sticka! Connect your accounts to unlock your workout
        soundtracks
      </Text>

      {/* <Text>Step 1: Connect your Strava account to get started</Text> */}

      <Pressable
        style={[styles.stravaButton, { opacity: isStravaConnected ? 0.5 : 1 }]}
        onPress={connectStrava}
        disabled={isStravaConnected}
      >
        <Text>
          {isStravaConnected ? "Connected ✅" : "Link Strava (Required)"}
        </Text>
      </Pressable>

      <Text>
        {/* Step 2: Connect your Spotify account to discover your workout playlists */}
      </Text>

      <Pressable style={styles.spotifyButton}>
        <Text>Link Spotify (Optional)</Text>
      </Pressable>

      <Pressable
        style={styles.continueButton}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  stravaButton: {
    width: 320,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    backgroundColor: "#fc4c02",
    borderRadius: 20,
  },
  spotifyButton: {
    width: 320,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    backgroundColor: "#1DB954",
    borderRadius: 20,
  },
  continueButton: {
    width: 320,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    backgroundColor: "#38f",
    borderRadius: 20,
    marginTop: "auto",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

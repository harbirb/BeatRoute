import {
  View,
  Text,
  Image,
  Pressable,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { StyleSheet } from "react-native";
import useStravaAuth from "@/components/useStravaAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSpotifyAuth from "@/components/useSpotifyAuth";

export default () => {
  const { connected: isStravaConnected, connectStrava } = useStravaAuth();
  const { connected: isSpotifyConnected, connectSpotify } = useSpotifyAuth();
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Check if the user has completed onboarding call db instead of async storage
      const status = await AsyncStorage.getItem("hasCompletedOnboarding");
      if (status === "true") {
        router.replace("/(tabs)");
      }
    };
    checkOnboardingStatus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={{ width: 100, height: 100 }}
          source={require("../assets/images/beatroute.png")}
        ></Image>
        <Text style={styles.title}>BeatRoute</Text>

        <Text style={styles.subtitle}>
          Welcome to BeatRoute! Add unique workout stickers to your photos and
          discover your workout soundtracks. Connect your accounts below to get
          started!
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <Text>
            Unlock your custom workout{" "}
            <Text style={{ fontWeight: "bold" }}>route</Text> stickers
          </Text>

          <TouchableOpacity
            style={[
              styles.stravaButton,
              styles.sharedButton,
              { opacity: isStravaConnected ? 0.5 : 1 },
            ]}
            onPress={connectStrava}
            disabled={isStravaConnected}
          >
            <Text style={styles.buttonText}>
              {isStravaConnected ? "Strava connected ✅" : "Link Strava "}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Text>
            See the <Text style={{ fontWeight: "bold" }}>beats</Text> powering
            your workouts
          </Text>

          <TouchableOpacity
            style={[
              styles.spotifyButton,
              styles.sharedButton,
              { opacity: isSpotifyConnected ? 0.5 : 0.5 },
            ]}
            disabled={isSpotifyConnected}
            onPress={connectSpotify}
          >
            <Text style={styles.buttonText}>
              {isSpotifyConnected ? "Spotify connected ✅" : "Link Spotify "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            styles.sharedButton,
            { opacity: isStravaConnected ? 1 : 0.5 },
          ]}
          disabled={!isStravaConnected}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const sharedButtonStyles = {
  width: "90%",
  height: 68,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 20,
};

const styles = StyleSheet.create({
  container: {
    margin: 30,
    marginTop: 60,
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  sharedButton: {
    width: "90%",
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  stravaButton: {
    backgroundColor: "#fc4c02",
  },
  spotifyButton: {
    backgroundColor: "#1DB954",
  },
  continueButton: {
    backgroundColor: "#38f",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  contentContainer: {
    gap: 20,
    flex: 1,
    justifyContent: "center",
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
});

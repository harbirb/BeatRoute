import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  Colors,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
} from "@/constants/theme";

const FEATURES = [
  { icon: "🏃", text: "Sync your Strava activities" },
  { icon: "🎵", text: "See your workout soundtrack" },
  { icon: "📸", text: "Share workout sticker cards" },
];

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { markWelcomeSeen } = useAuth();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        {/* Logo + wordmark */}
        <View style={styles.logoArea}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.wordmark, { color: theme.text }]}>
            BeatRoute
          </Text>
        </View>

        {/* Tagline */}
        <View style={styles.taglineArea}>
          <Text style={[styles.tagline, { color: theme.text }]}>
            Your runs, soundtracked.
          </Text>
          <Text style={[styles.description, { color: theme.icon }]}>
            Connect Strava and Spotify to see exactly which songs were playing
            during every workout.
          </Text>
        </View>

        {/* Feature bullets */}
        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                {f.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA pinned to bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: theme.tint }]}
          onPress={markWelcomeSeen}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.large,
    justifyContent: "center",
    gap: SPACING.large * 2,
  },
  logoArea: {
    alignItems: "center",
    gap: SPACING.small,
  },
  logo: {
    width: 80,
    height: 80,
  },
  wordmark: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
  },
  taglineArea: {
    gap: SPACING.small,
  },
  tagline: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: 32,
  },
  description: {
    fontSize: FONT_SIZE.medium,
    lineHeight: 24,
  },
  features: {
    gap: SPACING.medium,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.medium,
  },
  featureIcon: {
    fontSize: FONT_SIZE.large,
  },
  featureText: {
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.medium,
  },
  footer: {
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.large,
  },
  ctaButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.bold,
  },
});

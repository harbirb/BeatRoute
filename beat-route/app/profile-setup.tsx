import { useState } from "react";
import {
  TextInput,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { ProgressDots } from "../components/ProgressDots";
import StravaOAuthButton from "../components/StravaOAuthButton";
import SpotifyOAuthButton from "../components/SpotifyOAuthButton";
import {
  Colors,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
} from "../constants/theme";

export default function ProfileSetupScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const {
    session,
    profile,
    isStravaConnected,
    isSpotifyConnected,
    refetchProfile,
    refetchConnectedServices,
    markConnectServicesSeen,
  } = useAuth();

  const [name, setName] = useState(profile?.name ?? "");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!name.trim() || !session) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ name: name.trim() })
      .eq("id", session.user.id);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    await refetchProfile();
    await markConnectServicesSeen();
  }

  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressDots total={2} current={2} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Set up your profile
            </Text>
            <Text style={[styles.subtitle, { color: theme.icon }]}>
              Enter your name and connect your apps to get the most out of
              BeatRoute.
            </Text>
          </View>

          {/* Name input */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              Your name
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.icon }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Your name"
                placeholderTextColor={theme.icon}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                autoCorrect={false}
                autoFocus
                editable={!loading}
              />
            </View>
          </View>

          {/* Connect services */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              Connect your apps
            </Text>

            {/* Strava card */}
            <View
              style={[
                styles.serviceCard,
                {
                  borderColor: isStravaConnected ? theme.tint : theme.icon,
                  backgroundColor:
                    colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9",
                },
              ]}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceTitleRow}>
                  <Text style={[styles.serviceName, { color: theme.text }]}>
                    Strava
                  </Text>
                  <Text style={[styles.serviceTag, { color: "#fc4c02" }]}>
                    Required
                  </Text>
                </View>
                {isStravaConnected && (
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
                )}
              </View>
              <Text style={[styles.serviceDescription, { color: theme.icon }]}>
                Imports your workout activities.
              </Text>
              {!isStravaConnected && (
                <View style={styles.buttonWrapper}>
                  <StravaOAuthButton />
                </View>
              )}
            </View>

            {/* Spotify card */}
            <View
              style={[
                styles.serviceCard,
                {
                  borderColor: isSpotifyConnected ? theme.tint : theme.icon,
                  backgroundColor:
                    colorScheme === "dark" ? "#1a1a1a" : "#f9f9f9",
                },
              ]}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceTitleRow}>
                  <Text style={[styles.serviceName, { color: theme.text }]}>
                    Spotify
                  </Text>
                  <Text style={[styles.serviceTag, { color: "#1DB954" }]}>
                    Recommended
                  </Text>
                </View>
                {isSpotifyConnected && (
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
                )}
              </View>
              <Text style={[styles.serviceDescription, { color: theme.icon }]}>
                Matches songs to your workouts.
              </Text>
              {!isSpotifyConnected && (
                <View style={styles.buttonWrapper}>
                  <SpotifyOAuthButton />
                </View>
              )}
            </View>

            {/* Refresh link */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refetchConnectedServices}
            >
              <Text style={[styles.refreshText, { color: theme.tint }]}>
                {/* TODO change this so user does not have to check agian, it should be automatic */}
                Check again
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Continue CTA */}
        <View style={[styles.footer, { borderTopColor: theme.icon + "22" }]}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: canContinue ? theme.tint : theme.icon,
                opacity: canContinue ? 1 : 0.5,
              },
            ]}
            onPress={handleContinue}
            disabled={loading || !canContinue}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.continueText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.large,
    gap: SPACING.large,
    paddingBottom: SPACING.large * 2,
  },
  header: {
    gap: SPACING.small,
  },
  title: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
  },
  subtitle: {
    fontSize: FONT_SIZE.medium,
    lineHeight: 24,
  },
  section: {
    gap: SPACING.small,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.medium,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: RADIUS.medium,
    height: 56,
    justifyContent: "center",
    paddingHorizontal: SPACING.medium,
  },
  input: {
    fontSize: FONT_SIZE.medium,
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
    alignItems: "flex-start",
  },
  serviceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.small,
  },
  serviceName: {
    fontSize: FONT_SIZE.large,
    fontWeight: FONT_WEIGHT.bold,
  },
  serviceTag: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
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
  footer: {
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.large,
    paddingTop: SPACING.medium,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  continueButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.bold,
  },
});

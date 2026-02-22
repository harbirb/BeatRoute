import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Alert,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressDots } from "../components/ProgressDots";

import { supabase } from "../lib/supabase";
import {
  Colors,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
} from "../constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [resendCooldown, setResendCooldown] = useState(0);

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function signInWithEmail() {
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setStep("otp");
      setResendCooldown(60);
    }
  }

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) verifyOtp();
  }, [otp]);

  async function verifyOtp() {
    if (!otp) return;
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Brand */}
        <View style={styles.brandArea}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={[styles.brandName, { color: theme.text }]}>
            BeatRoute
          </Text>
        </View>

        <ProgressDots total={2} current={1} />

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {step === "email" ? "Welcome" : "Check your inbox"}
          </Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>
            {step === "email"
              ? "Enter your email to sign in or create an account."
              : `We sent a login link to ${email}. Click it to sign in or enter the code below.`}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {step === "email" ? (
            <View style={[styles.inputWrapper, { borderColor: theme.icon }]}>
              <TextInput
                key="email-input"
                style={[styles.input, { color: theme.text }]}
                onChangeText={setEmail}
                value={email}
                placeholder="name@example.com"
                placeholderTextColor={theme.icon}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                onSubmitEditing={signInWithEmail}
                returnKeyType="go"
              />
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: theme.tint }]}
                onPress={signInWithEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={[styles.inputWrapper, { borderColor: theme.icon }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  onChangeText={setOtp}
                  value={otp}
                  placeholder="123456"
                  placeholderTextColor={theme.icon}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: theme.tint }]}
                  onPress={verifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setStep("email");
                  setEmail("");
                  setOtp("");
                  setResendCooldown(0);
                }}
                style={styles.backButton}
              >
                <Text style={[styles.backButtonText, { color: theme.tint }]}>
                  Change email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resendCooldown === 0 ? signInWithEmail : undefined}
                style={styles.backButton}
                disabled={resendCooldown > 0}
              >
                <Text
                  style={[
                    styles.backButtonText,
                    {
                      color: resendCooldown > 0 ? theme.icon : theme.tint,
                    },
                  ]}
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
    justifyContent: "center",
    gap: SPACING.large,
  },
  brandArea: {
    alignItems: "center",
    gap: SPACING.small,
    marginBottom: SPACING.small,
  },
  brandLogo: {
    width: 64,
    height: 64,
  },
  brandName: {
    fontSize: FONT_SIZE.large,
    fontWeight: FONT_WEIGHT.bold,
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
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: RADIUS.medium,
    paddingRight: SPACING.small,
    height: 56,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: SPACING.medium,
    fontSize: FONT_SIZE.medium,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: SPACING.medium,
    alignSelf: "center",
    padding: SPACING.small,
  },
  backButtonText: {
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.medium,
  },
});

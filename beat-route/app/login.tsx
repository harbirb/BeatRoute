import { useState } from "react";
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
} from "react-native";
import { Stack } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const theme = Colors.light;

  async function signInWithEmail() {
    if (!email) return;
    setLoading(true);
    const redirectTo = makeRedirectUri();

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setStep("otp");
    }
  }

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
                  onSubmitEditing={verifyOtp}
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
                }}
                style={styles.backButton}
              >
                <Text style={[styles.backButtonText, { color: theme.tint }]}>
                  Change email
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
  },
  header: {
    marginBottom: SPACING.large * 2,
  },
  title: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.small,
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

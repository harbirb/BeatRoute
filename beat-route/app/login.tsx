import { Link, Stack } from "expo-router";
import { StyleSheet, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "../lib/supabase";

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const redirectTo = makeRedirectUri();
    console.log(redirectTo);

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Check your inbox for the login link!");
    }
    setLoading(false);
  }

  async function verifyOtp() {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Login",
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.verticallySpaced}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.verticallySpaced}>
          <Button
            title="Sign in with Magic Link"
            disabled={loading}
            onPress={() => signInWithEmail()}
          />
        </View>

        <View style={[styles.verticallySpaced, { marginTop: 20 }]}>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Or enter the code manually
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setOtp(text)}
            value={otp}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button
            title="Verify Code"
            disabled={loading}
            onPress={() => verifyOtp()}
          />
        </View>

        <Link href="/" style={styles.link}>
          Try to navigate to home screen!
        </Link>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  link: {
    fontSize: 18,
    marginTop: 15,
    paddingVertical: 15,
  },
});

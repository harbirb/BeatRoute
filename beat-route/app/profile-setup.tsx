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
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetupScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, refetchProfile } = useAuth();
  const router = useRouter();

  async function updateProfile() {
    if (!name || !session) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", session.user.id);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      // update profile in AuthContext
      await refetchProfile();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          What should we call you?
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 12,
              marginRight: 10,
              borderRadius: 8,
            }}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            onSubmitEditing={updateProfile}
            returnKeyType="done"
            autoCorrect={false}
            autoFocus
            editable={!loading}
          />
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: loading ? "#ccc" : "#007AFF",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={updateProfile}
            disabled={loading || !name}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

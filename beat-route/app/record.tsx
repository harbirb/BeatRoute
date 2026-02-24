import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RecordScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.text}>Record screen — coming in Phase 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151718",
  },
  closeButton: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

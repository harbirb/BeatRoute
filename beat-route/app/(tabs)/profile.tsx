import { Text, View, Button, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { ThemedView } from "@/app-example/components/themed-view";
import { StyleSheet, Image } from "react-native";
import SignOutButton from "@/components/SignOutButton";
import ParallaxScrollView from "@/app-example/components/parallax-scroll-view";

export default function ProfileScreen() {
  const { profile } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Username:</Text>
        <Text>{profile?.username}</Text>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Full name:</Text>
        <Text>{profile?.full_name}</Text>
      </View>
      <SignOutButton />
    </View>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

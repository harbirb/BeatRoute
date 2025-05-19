import { StyleSheet, Platform, View, TouchableOpacity } from "react-native";
import { Card, Text } from "@rneui/themed";
import StravaAuth from "@/components/StravaAuth";
import SpotifyAuth from "@/components/SpotifyAuth";
import TestButton from "@/components/TestButton";
import TestMap from "@/components/TestMap";
import { MapSticker } from "@/components/MapSticker";
import { mockActivityData } from "@/mockActivityData";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>Test button here</Text>
        <TestButton />
      </Card>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>Step 1: Connect your Strava Account</Text>
        <StravaAuth />
      </Card>
      <Card>
        <Text style={styles.title}>Step 2: Connect your Spotify Account</Text>
        <SpotifyAuth
          onAuthSuccess={function (token: string): void {
            console.log("Auth token:", token);
          }}
        />
      </Card>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          supabase.functions.invoke("get-tracklists");
        }}
      >
        <Text style={styles.title}>Test Tracklists</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  card: { borderRadius: 8, padding: 16 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  button: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});

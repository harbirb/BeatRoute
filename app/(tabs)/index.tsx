import { StyleSheet, Platform, View } from "react-native";
import { Card, Text } from "@rneui/themed";
import StravaAuth from "@/components/StravaAuth";
import SpotifyAuth from "@/components/ui/SpotifyAuth";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>Step 1: Connect your Strava Account</Text>
        <StravaAuth onAuthSuccess={(token) => console.log()} />
      </Card>
      <Card>
        <Text style={styles.title}>Step 2: Connect your Spotify Account</Text>
        <SpotifyAuth
          onAuthSuccess={function (token: string): void {
            console.log("Auth token:", token);
          }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  card: { borderRadius: 8, padding: 16 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
});

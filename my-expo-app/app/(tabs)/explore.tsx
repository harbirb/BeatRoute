import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Button } from "@rneui/themed/dist/Button";
import { supabase } from "@/lib/supabase";
import { Card } from "react-native-paper";
import TestButton from "@/components/TestButton";
import StravaAuth from "@/components/StravaAuth";
import SpotifyAuth from "@/components/SpotifyAuth";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        paddingTop: 50,
        gap: 20,
        alignItems: "center",
      }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText>{" "}
          to see how to load{" "}
          <ThemedText style={{ fontFamily: "SpaceMono" }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <View>
        <Text>Test button here</Text>
        <TestButton />
      </View>
      <View>
        <Text style={styles.title}>Step 1: Connect your Strava Account</Text>
        <StravaAuth />
      </View>
      <View>
        <Text style={styles.title}>Step 2: Connect your Spotify Account</Text>
        <SpotifyAuth
          onAuthSuccess={function (token: string): void {
            console.log("Auth token:", token);
          }}
        />
      </View>
      <TouchableOpacity
        style={{ backgroundColor: "#33aaff", padding: 12, borderRadius: 8 }}
        onPress={() => {
          // supabase.functions.invoke("get-tracklists");
          alert("Pressed!");
        }}
      >
        <Text style={styles.title}>Test Tracklists</Text>
      </TouchableOpacity>

      <Button title="sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#fff" },
});

import { useLocalSearchParams, Stack } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Activity, RunActivity, useData } from "@/context/DataContext";
import * as Clipboard from "expo-clipboard";
import { RunDetailCard } from "@/components/RunDetailCard";
import { TrackList } from "@/components/TrackList";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import Carousel from "@/components/Carousel";

export default function ActivityDetailScreen() {
  const { activities, loading } = useData();
  const { id } = useLocalSearchParams();
  const activity = activities.find((act: Activity) => act.id === id);

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  if (!activity) {
    return (
      <View style={styles.centered}>
        <Text>Activity not found</Text>
      </View>
    );
  }

  const handleCopy = async () => {
    try {
      const trackListText = activity.tracklist
        .map((song) => `${song.title} - ${song.artists.join(", ")}`)
        .join("\n");
      await Clipboard.setStringAsync(trackListText);
      Alert.alert("Copied playlist to clipboard");
    } catch (error) {
      Alert.alert("Error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: activity.name }} />
      {activity.type === "run" && (
        <RunDetailCard item={activity as RunActivity} />
      )}
      {/* Future: Add RideDetailCard when RideActivity is implemented */}
      <View>
        <View style={styles.playlistHeaderContainer}>
          <Text style={styles.playlistHeader}>Playlist</Text>
          <Button title="Copy" onPress={handleCopy}></Button>
        </View>
        <TrackList tracks={activity.tracklist} />
      </View>
      <View>
        <Carousel data={["Sticker 1", "Sticker 2", "Sticker 3"]} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: SPACING.medium,
    gap: SPACING.medium,
  },
  playlistHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playlistHeader: {
    fontSize: FONT_SIZE.large,
    fontWeight: FONT_WEIGHT.bold,
  },
});

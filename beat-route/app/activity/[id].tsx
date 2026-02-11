import { useEffect, useState } from "react";
import { useLocalSearchParams, Stack, Link } from "expo-router";
import { ActivitySong } from "@/context/DataContext";
import { fetchActivitySongs } from "@/lib/api";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Activity, useData } from "@/context/DataContext";
import * as Clipboard from "expo-clipboard";
import { RunDetailCard } from "@/components/RunDetailCard";
import { TrackList } from "@/components/TrackList";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import Carousel from "@/components/Carousel";
import Stickers from "@/components/Stickers";

export default function ActivityDetailScreen() {
  const { activities, loading } = useData();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activity = activities.find((act: Activity) => act.id === id);
  const [activitySongData, setActivitySongData] = useState<ActivitySong[]>([]);
  const [songsLoading, setSongsLoading] = useState(true);

  // load songs on mount
  useEffect(() => {
    if (!id) {
      return;
    }
    const loadSongs = async () => {
      setSongsLoading(true);
      try {
        const songs = await fetchActivitySongs(id);
        setActivitySongData(songs);
      } catch (e) {
        console.error("Failed to load activity songs", e);
        setActivitySongData([]);
      } finally {
        setSongsLoading(false);
      }
    };

    loadSongs();
  }, [id]);

  if (loading || songsLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  if (!activity) {
    return (
      <View style={styles.centered}>
        <Text>Activity not found</Text>
      </View>
    );
  }

  // const handleCopy = async () => {
  //   try {
  //     const trackListText = activitySongs
  //       .map((song) => `${song.title} - ${song.artists.join(", ")}`)
  //       .join("\n");
  //     await Clipboard.setStringAsync(trackListText);
  //     Alert.alert("Copied playlist to clipboard");
  //   } catch (error) {
  //     Alert.alert("Error");
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: activity.name }} />
      {activity.type === "run" && <RunDetailCard item={activity} />}
      {/* Future: Add RideDetailCard when RideActivity is implemented */}
      {/* Playlist section */}
      {activitySongData.length > 0 && (
        <View>
          <View style={styles.playlistHeaderContainer}>
            <Text style={styles.playlistHeader}>Playlist</Text>
            {/* <Button title="Copy" onPress={handleCopy}></Button> */}
          </View>
          <TrackList tracks={activitySongData} />
        </View>
      )}
      {/* Sticker section */}
      <View>
        <View style={styles.playlistHeaderContainer}>
          <Text style={styles.playlistHeader}>Stickers</Text>
          <Link
            href={{ pathname: "/stickers-modal", params: { id: activity.id } }}
            asChild
          >
            <Button title="Edit"></Button>
          </Link>
        </View>
        <Carousel data={Stickers(activity)} />
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

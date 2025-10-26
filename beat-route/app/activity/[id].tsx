import { useLocalSearchParams, Stack } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Activity, Song, RunActivity, useData } from "@/context/DataContext";
import { Image } from "expo-image";
import * as Clipboard from "expo-clipboard";

const PropertyValuePair = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.pvpContainer}>
    <Text style={styles.pvpLabel}>{label}</Text>
    <Text style={styles.pvpValue}>{value}</Text>
  </View>
);

const RunDetailCard = ({ item }: { item: RunActivity }) => (
  <View style={styles.card}>
    <View style={styles.activityDetailContainer}>
      <PropertyValuePair
        label="Distance"
        value={item.distanceInMeters.toString()}
      />
      <PropertyValuePair
        label="Time"
        value={item.durationInSeconds.toString()}
      />
      <PropertyValuePair label="Pace" value={item?.pace} />
      {item.elevationGainInMeters && (
        <PropertyValuePair
          label="Elevation Gain"
          value={item.elevationGainInMeters.toString()}
        />
      )}
      {item.averageHeartRate && (
        <PropertyValuePair
          label="Avg Heart Rate"
          value={item.averageHeartRate.toString()}
        />
      )}
    </View>
  </View>
);

const TrackItem = ({ song }: { song: Song }) => (
  <Pressable onPress={() => Linking.openURL(song.url)}>
    <View style={styles.trackContainer}>
      <Image source={song.imageUrl} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{song.title}</Text>
        <Text style={styles.trackArtist}>{song.artists.join(", ")}</Text>
      </View>
    </View>
  </Pressable>
);

const TrackList = ({ tracks }: { tracks: Song[] }) => (
  <View style={styles.card}>
    <View style={styles.trackListContainer}>
      {tracks.map((song) => (
        <TrackItem key={song.id} song={song} />
      ))}
    </View>
  </View>
);

export default function ActivityDetailScreen() {
  const { activities, loading } = useData();
  const { id } = useLocalSearchParams();
  const activity = activities.find((act: Activity) => act.id === id);

  const handleCopy = async () => {
    if (!activity) return;

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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen options={{ title: activity.name }} />
        {activity.type === "run" && (
          <RunDetailCard item={activity as RunActivity} />
        )}
        {/* Future: Add RideDetailCard when RideActivity is implemented */}
        <View style={styles.playlistContainer}>
          <View style={styles.playlistHeaderContainer}>
            <Text style={styles.playlistHeader}>Playlist</Text>
            <Button title="Copy" onPress={handleCopy}></Button>
          </View>
          <TrackList tracks={activity.tracklist} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  activityDetailContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  pvpContainer: {
    alignItems: "center",
    width: "50%", // 2 items per row
    marginVertical: 8,
  },
  pvpLabel: {
    fontSize: 16,
    color: "gray",
  },
  pvpValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  trackContainer: {
    flexDirection: "row",
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    gap: 4,
    justifyContent: "center",
  },
  trackTitle: {
    fontSize: 16,
  },
  trackArtist: {
    fontSize: 14,
    color: "gray",
  },
  trackListContainer: {
    gap: 8,
  },
  playlistContainer: {},
  playlistHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playlistHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

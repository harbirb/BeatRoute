import { act, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { SongTile } from "./SongTile";

type Props = {
  activity_id: number;
  distance: number;
  name: string;
  tracklist: any[];
  start_date: string;
};

const textColor = "white";

export const ActivityTracklist: React.FC<Props> = ({
  activity_id,
  distance,
  name,
  tracklist,
  start_date,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleShare = () => {
    const selectedTracks = tracklist.filter((track) => {
      return selectedItems.includes(track.played_at);
    });
    const shareMessage = selectedTracks.map((track) => {
      track.track_name - track.track_artists.join(", ");
    });
    // upload this by calling edge fn
  };

  const handleCheckboxPress = (played_at: string) => {
    if (selectedItems.includes(played_at)) {
      setSelectedItems(selectedItems.filter((id) => id !== played_at));
    } else {
      setSelectedItems([...selectedItems, played_at]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === tracklist.length) {
      setSelectedItems([]);
      return;
    } else {
      setSelectedItems(tracklist.map((track) => track.played_at));
    }
  };

  return (
    <View>
      {/* link to actual activity */}
      <Pressable onPress={() => alert("opening strava")}>
        <Text style={styles.activityTitle}>{name}</Text>
      </Pressable>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={handleSelectAll}
        >
          <Text>Select all songs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => alert("Shared to Strava")}
        >
          <Text>Share to Strava</Text>
        </TouchableOpacity>
      </View>

      {tracklist.length === 0 && <Text>No songs for this activity</Text>}
      <FlatList
        data={tracklist}
        renderItem={({ item }) => (
          <SongTile
            {...item}
            onCheckboxPress={() => handleCheckboxPress(item.played_at)}
            checked={selectedItems.includes(item.played_at)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectAllButton: {
    backgroundColor: "#38f",
    padding: 11,
    borderRadius: 5,
  },
  shareButton: {
    backgroundColor: "#fc4c02",
    padding: 11,
    borderRadius: 5,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
});

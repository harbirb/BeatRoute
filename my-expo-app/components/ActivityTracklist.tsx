import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { SongTile } from "./SongTile";
import { supabase } from "@/lib/supabase";

type Props = {
  activity_id: number;
  distance: number;
  name: string;
  tracklist: any[];
  start_date: string;
};

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
    const shareMessage = selectedTracks
      .map((track) => {
        return track.track_name + " - " + track.track_artists.join(", ");
      })
      .join("\n");
    console.log(shareMessage);
    supabase.functions.invoke("strava-post", {
      body: { message: shareMessage, activity_id },
    });
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
      <Pressable
        style={({ pressed }) => [
          pressed && { opacity: 0.5 },
          styles.activityLink,
        ]}
        onPress={() =>
          Linking.openURL("https://www.strava.com/activities/" + activity_id)
        }
      >
        <Text style={styles.activityTitle}>{name}</Text>
      </Pressable>
      {tracklist.length > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleSelectAll}
          >
            <Text>Select all songs</Text>
          </TouchableOpacity>
          <Pressable
            disabled={selectedItems.length === 0}
            style={[
              styles.shareButton,
              selectedItems.length === 0 && { opacity: 0.5 },
            ]}
            onPress={() => {
              handleShare();
              alert("Shared to Strava");
            }}
          >
            <Text>Share to Strava</Text>
          </Pressable>
        </View>
      )}

      {tracklist.length === 0 && (
        <Text style={{ color: "#fff" }}>No songs for this activity</Text>
      )}
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
  activityLink: {
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fc4c02",
  },
});

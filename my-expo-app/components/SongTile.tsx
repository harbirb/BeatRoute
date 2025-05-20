import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";

type SongTileProps = {
  track_name: string;
  track_artists: string[];
  uri: string;
  onCheckboxPress: () => void;
  checked: boolean;
};

export const SongTile: React.FC<SongTileProps> = ({
  track_name,
  track_artists,
  uri,
  onCheckboxPress,
  checked,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onCheckboxPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>
      <TouchableOpacity onPress={() => alert("opening spotify")}>
        <Text style={styles.songTitle}>{track_name}</Text>
        <Text style={styles.songArtist}>{track_artists.join(", ")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#bbb",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.5,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
  },
  songArtist: {
    fontSize: 14,
    color: "#b3b3b3", // Spotify's gray for secondary text
  },
});

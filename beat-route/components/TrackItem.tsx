import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { ActivitySong } from "@/context/DataContext";
import {
  Colors,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/constants/theme";

export const TrackItem = ({ song }: { song: ActivitySong }) => (
  <Pressable onPress={() => Linking.openURL(song.spotifyUrl)}>
    <View style={styles.trackContainer}>
      <Image source={song.albumArtUrl} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{song.title}</Text>
        <Text style={styles.trackArtist}>{song.artists.join(", ")}</Text>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  trackContainer: {
    flexDirection: "row",
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.small,
    marginRight: SPACING.small,
  },
  trackInfo: {
    gap: SPACING.xsmall,
    justifyContent: "center",
  },
  trackTitle: {
    fontSize: FONT_SIZE.medium,
    color: Colors.light.text,
  },
  trackArtist: {
    fontSize: FONT_SIZE.small,
    color: Colors.light.icon,
  },
});

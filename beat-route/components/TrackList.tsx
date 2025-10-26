import { View, StyleSheet } from "react-native";
import { Song } from "@/context/DataContext";
import Card from "@/components/ui/Card";
import { TrackItem } from "@/components/TrackItem";
import { SPACING } from "@/constants/theme";

export const TrackList = ({ tracks }: { tracks: Song[] }) => (
  <Card>
    <View style={styles.trackListContainer}>
      {tracks.map((song) => (
        <TrackItem key={song.id} song={song} />
      ))}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  trackListContainer: {
    gap: SPACING.small,
  },
});

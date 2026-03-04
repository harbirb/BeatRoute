import { router } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Activity } from "@/context/DataContext";
import { Colors, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import Card from "./ui/Card";
import { formatDistance, formatTime } from "@/lib/format";
import Polyline from "./Polyline";

export default function ActivityPreview({ item }: { item: Activity }) {
  return (
    <Pressable onPress={() => router.navigate(`/activity/${item.id}`)}>
      <Card>
        <View style={styles.container}>
          {item.polyline && (
            <View style={styles.polylineBackground} pointerEvents="none">
              <Polyline
                encodedPolyline={item.polyline}
                size={120}
                style={{
                  color: "black",
                  fontWeight: "normal",
                  fontSize: 14,
                  strokeWidth: 2,
                }}
              />
            </View>
          )}
          <View style={styles.topRow}>
            <View style={styles.titleLocationContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>

              <Text style={styles.cardSubtitle}>
                {formatDistance(item.distanceInMeters || 0)}
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.cardSubtitle}>
              {formatTime(item.durationInSeconds)}
            </Text>
            {item.startLatLng && (
              <Text style={styles.cardSubtitle}>
                {item.startLatLng[0].toFixed(4)},{" "}
                {item.startLatLng[1].toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.large,
  },
  cardTitle: { fontSize: FONT_SIZE.large, fontWeight: FONT_WEIGHT.bold },
  cardSubtitle: { fontSize: FONT_SIZE.medium, color: Colors.light.icon },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleLocationContainer: {
    // flexDirection: "column",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  polylineBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.15,
  },
});

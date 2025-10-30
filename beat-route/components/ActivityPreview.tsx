import { router } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Activity } from "@/context/DataContext";
import { Colors, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import Card from "./ui/Card";

export default function ActivityPreview({ item }: { item: Activity }) {
  return (
    <Pressable onPress={() => router.push(`/activity/${item.id}`)}>
      <Card>
        <View style={styles.container}>
          <View style={styles.topRow}>
            <View style={styles.titleLocationContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{"Vancouver, BC"}</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.cardSubtitle}>5.4 km</Text>
            <Text style={styles.cardSubtitle}>3 songs</Text>
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
});

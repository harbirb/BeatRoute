import { View, StyleSheet } from "react-native";
import { RunActivity } from "@/context/DataContext";
import Card from "@/components/ui/Card";
import PropertyValuePair from "@/components/PropertyValuePair";
import { StickerStyle } from "./Stickers";

export const RunDetailCard = ({ item }: { item: RunActivity }) => {
  const details = [
    { label: "Distance", value: item.distanceInMeters.toString() },
    { label: "Time", value: item.durationInSeconds.toString() },
    { label: "Pace", value: item.pace },
    { label: "Elevation Gain", value: item.elevationGainInMeters?.toString() },
    { label: "Avg Heart Rate", value: item.averageHeartRate?.toString() },
  ];

  const defaultStyle: StickerStyle = {
    color: "black",
    fontSize: 20,
    fontWeight: "regular",
    strokeWidth: 2,
  };

  return (
    <Card>
      <View style={styles.activityDetailContainer}>
        {details.map((detail) =>
          detail.value ? (
            <View key={detail.label} style={styles.halfWidth}>
              <PropertyValuePair label={detail.label} value={detail.value} />
            </View>
          ) : null
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  activityDetailContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  halfWidth: {
    width: "50%",
  },
});

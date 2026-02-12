import { View, StyleSheet } from "react-native";
import { Activity } from "@/context/DataContext";
import Card from "@/components/ui/Card";
import PropertyValuePair from "@/components/PropertyValuePair";

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export const DetailCard = ({ item }: { item: Activity }) => {
  const details = [
    {
      label: "Distance",
      value: item.distanceInMeters
        ? formatDistance(item.distanceInMeters)
        : undefined,
    },
    {
      label: "Time",
      value: item.durationInSeconds
        ? formatTime(item.durationInSeconds)
        : undefined,
    },
    { label: "Pace", value: item.pace },
    {
      label: "Avg Speed",
      value: item.averageSpeedKph ? `${item.averageSpeedKph} km/h` : undefined,
    },
    { label: "Elevation Gain", value: item.elevationGainInMeters?.toString() },
    { label: "Avg Heart Rate", value: item.averageHeartRate?.toString() },
  ];

  return (
    <Card>
      <View style={styles.activityDetailContainer}>
        {details.map((detail) =>
          detail.value ? (
            <View key={detail.label} style={styles.halfWidth}>
              <PropertyValuePair label={detail.label} value={detail.value} />
            </View>
          ) : null,
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

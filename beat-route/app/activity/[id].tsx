import { useLocalSearchParams, Stack } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Activity, RunActivity, useData } from "@/context/DataContext";

const PropertyValuePair = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.pvpContainer}>
    <Text style={styles.pvpLabel}>{label}</Text>
    <Text style={styles.pvpValue}>{value}</Text>
  </View>
);

const ActivityCard = ({ item }: { item: RunActivity }) => (
  <View style={styles.card}>
    <PropertyValuePair
      label="Distance"
      value={item.distanceInMeters.toString()}
    />
    <PropertyValuePair
      label="Time"
      value={item.durationInSeconds.toString()}
    />
    <PropertyValuePair label="Pace" value={item?.pace} />
  </View>
);

export default function ActivityDetailScreen() {
  const { activities, loading } = useData();
  const { id } = useLocalSearchParams();
  const activity = activities.find((act: Activity) => act.id === id);

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
    <View style={styles.container}>
      <Stack.Screen options={{ title: activity.name }} />
      {activity.type === "run" && <ActivityCard item={activity as RunActivity} />}
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
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  pvpContainer: {
    alignItems: "center",
  },
  pvpLabel: {
    fontSize: 16,
    color: "gray",
  },
  pvpValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
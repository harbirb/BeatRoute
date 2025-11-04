import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text } from "react-native";
import { Activity, useData } from "@/context/DataContext";

export default function ActivityDetailModal() {
  const { id } = useLocalSearchParams();
  const { activities } = useData();
  const activity = activities.find((act: Activity) => act.id === id);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Activity ID: ${id}`,
        }}
      />
    </View>
  );
}

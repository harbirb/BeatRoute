import { Link, router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from "@/context/DataContext";
import ActivityPreview from "@/components/ActivityPreview";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

export default function HomeScreen() {
  const { activities, loading } = useData();

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activities</Text>
        <Button title="Profile" onPress={() => router.push("/profile")} />
      </View>
      <FlatList
        data={activities}
        renderItem={({ item }) => <ActivityPreview item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    gap: SPACING.medium,
  },
  header: {
    paddingBottom: SPACING.small,
    paddingHorizontal: SPACING.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: FONT_WEIGHT.bold,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

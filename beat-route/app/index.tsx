import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "@/context/DataContext";
import ActivityPreview from "@/components/ActivityPreview";
import { FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";

export default function HomeScreen() {
  const { activities, loading, refreshing, refresh } = useData();

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <View style={styles.wrapper}>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        />
      </SafeAreaView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/record")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingBottom: 80,
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
  fab: {
    position: "absolute",
    bottom: SPACING.large,
    right: SPACING.large,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});

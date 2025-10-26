import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData, Activity } from "@/context/DataContext";

const ActivityPreview = ({ item }: { item: Activity }) => {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/activity/${item.id}`)}
    >
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
    </Pressable>
  );
};

export default function HomeScreen() {
  const { activities, loading } = useData();

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Activities</Text>
        </View>
        <FlatList
          data={activities}
          renderItem={({ item }) => <ActivityPreview item={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    // paddingHorizontal: 16,
    // Cannot use padding here since Flatlist clips shadow on cards
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    gap: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold" },
  cardSubtitle: { fontSize: 16, color: "gray" },
  cardInfo: { fontSize: 14, color: "darkgray" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  titleLocationContainer: {
    // flexDirection: "column",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

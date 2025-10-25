import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getActivities } from '@/lib/mock-db';

// Define the shape of the lightweight activity object
interface LightweightActivity {
  id: string;
  name: string;
  artist: string;
  songCount: number;
}

// The distinct component for rendering a single activity preview card.
const ActivityPreview = ({ item }: { item: LightweightActivity }) => {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/activity/${item.id}`)}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.artist}</Text>
      <Text style={styles.cardInfo}>{item.songCount} songs</Text>
    </Pressable>
  );
};

export default function HomeScreen() {
  const [activities, setActivities] = useState<LightweightActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const data = await getActivities();
      setActivities(data as LightweightActivity[]);
      setLoading(false);
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={({ item }) => <ActivityPreview item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 16, color: 'gray', marginTop: 4 },
  cardInfo: { fontSize: 14, color: 'darkgray', marginTop: 8 },
});

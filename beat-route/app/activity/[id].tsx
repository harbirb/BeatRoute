
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { getActivityById, Activity } from '@/lib/mock-db';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchActivity = async () => {
        setLoading(true);
        const data = await getActivityById(id);
        setActivity(data);
        setLoading(false);
      };
      fetchActivity();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  if (!activity) {
    return <Text style={styles.centered}>Activity not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: activity.name }} />
      <Text style={styles.title}>{activity.name}</Text>
      <Text style={styles.artist}>by {activity.artist}</Text>
      <Text style={styles.tracklistHeader}>Tracklist ({activity.songCount} songs)</Text>
      <FlatList
        data={activity.tracklist}
        keyExtractor={(item) => item.song}
        renderItem={({ item }) => (
          <View style={styles.tracklistItem}>
            <Text>{item.song} - {item.artist}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  artist: { fontSize: 20, color: 'gray', marginBottom: 16 },
  tracklistHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  tracklistItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

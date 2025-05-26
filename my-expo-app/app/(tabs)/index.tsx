import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityTracklist } from "@/components/ActivityTracklist";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [ActivityTracklists, setActivityTracklists] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTracklists = async () => {
      const { data, error } = await supabase.functions.invoke("get-tracklists");
      setActivityTracklists(data);
      setIsLoading(false);
    };
    fetchTracklists();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>My Songs</Text>
      </View>

      {isLoading && <ActivityIndicator style={{ flex: 1 / 2 }} />}

      <FlatList
        data={ActivityTracklists}
        renderItem={({ item }) => <ActivityTracklist {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 12,
    backgroundColor: "rgb(17, 24, 39)",
  },
  title: { fontSize: 28, fontWeight: "600", color: "white" },
});

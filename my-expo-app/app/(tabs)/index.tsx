import { StyleSheet, View, Text, FlatList } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityTracklist } from "@/components/ActivityTracklist";

export default function HomeScreen() {
  const [ActivityTracklists, setActivityTracklists] = useState<any>([]);

  useEffect(() => {
    const fetchTracklists = async () => {
      const { data, error } = await supabase.functions.invoke("get-tracklists");
      setActivityTracklists(data);
      console.log(data);
    };

    fetchTracklists();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>My Songs</Text>
      </View>

      <FlatList
        data={ActivityTracklists}
        renderItem={({ item }) => <ActivityTracklist {...item} />}
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

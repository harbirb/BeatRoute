import { StyleSheet, View, Text, FlatList } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityTracklist } from "@/components/ActivityTracklist";
import { isStravaConnected } from "@/lib/connectedServices";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [ActivityTracklists, setActivityTracklists] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTracklists = async () => {
      const { data, error } = await supabase.functions.invoke("get-tracklists");
      setActivityTracklists(data);
    };

    const checkOnboardingStatus = async () => {
      const status = await AsyncStorage.getItem("hasCompletedOnboarding");
      if (status === "true") {
        console.log("already onboarded");
        fetchTracklists();
      } else {
        console.log("sending to onboarding");
        router.replace("/onboard");
      }
    };
    checkOnboardingStatus();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>My Songs</Text>
      </View>

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

import StravaAuth from "@/components/StravaAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function Onboard() {
  const router = useRouter();

  const completeOnboarding = async () => {
    console.log("completed onboarding");
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      style={{
        backgroundColor: "pink",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Ni hao fine shyt. Please link your Strava account</Text>
      <StravaAuth onAuthSuccess={completeOnboarding} />
    </View>
  );
}

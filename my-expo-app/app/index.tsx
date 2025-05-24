import StravaAuth from "@/components/StravaAuth";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <Text>Ni Hao Fine Shyt</Text>
      <Text>Please connect your accounts to get started</Text>

      <StravaAuth onAuthSuccess={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

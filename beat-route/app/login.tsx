import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Login",
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Link href="/" style={styles.link}>
          Try to navigate to home screen!
        </Link>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    // backgroundColor: "red",s
    padding: 40,
  },
  link: {
    fontSize: 18,
    marginTop: 15,
    paddingVertical: 40,
    // backgroundColor: "#2089dc",
  },
});

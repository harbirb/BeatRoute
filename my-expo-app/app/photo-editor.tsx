import { usePreventRemove } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { View, Text, Image, Button, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const richmond = require("../assets/images/IMG_1014.jpg");

export default function PhotoEditor() {
  const router = useRouter();

  // usePreventRemove(true, () => {
  //   alert("Are you sure you want to leave?");
  // });

  return (
    <View style={styles.container}>
      <Image source={richmond} style={styles.image} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </Pressable>
      <Pressable style={styles.stickerButton} onPress={() => alert(":3")}>
        <MaterialCommunityIcons name="sticker-emoji" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "pink",
    position: "relative",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 20,
  },
  backButton: {
    position: "absolute",
    backgroundColor: "white",
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 99,
  },
  stickerButton: {
    position: "absolute",
    backgroundColor: "white",
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 99,
  },
});

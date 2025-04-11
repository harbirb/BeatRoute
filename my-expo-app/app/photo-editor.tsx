import { usePreventRemove } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { View, Text, Image, Button, StyleSheet, Pressable } from "react-native";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef, useState } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import Svg, { Circle } from "react-native-svg";
import { StickerModal } from "@/components/StickerModal";
import { EditorCanvas } from "@/components/EditorCanvas";

const richmond = require("../assets/images/IMG_1014.jpg");

export default function PhotoEditor() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, { format: "jpg", quality: 1 });
      if (!uri) return;

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Error sharing image:", error);
    }
  };

  // usePreventRemove(true, () => {
  //   alert("Are you sure you want to leave?");
  // });

  return (
    <View style={styles.container}>
      <EditorCanvas imageSource={richmond} ref={viewShotRef} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </Pressable>
      <Pressable
        style={styles.stickerButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="sticker-emoji" size={24} color="black" />
      </Pressable>
      <Pressable style={styles.shareButton} onPress={() => handleShare()}>
        <Ionicons name="share-social" size={24} color="black" />
      </Pressable>
      <StickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  imageContainer: {
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  image: {
    width: "100%",
    height: "100%",
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
  shareButton: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 50,
    right: 20,
    padding: 10,
    borderRadius: 99,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

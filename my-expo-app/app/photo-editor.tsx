import { useRouter } from "expo-router";
import { View, Text, Image, Button, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef, useState } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { StickerModal } from "@/components/StickerModal";
import { EditorCanvas } from "@/components/EditorCanvas";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Sticker {
  id: number;
  type: "polyline" | "text";
  data: string;
  color: string;
}

const richmond = require("../assets/images/IMG_1014.jpg");

export default function PhotoEditor() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const [stickers, setStickers] = useState<Sticker[]>([
    {
      id: 1,
      type: "polyline",
      data: "50,0 65,30 95,35 75,55 80,85 50,70 20,85 25,55 5,35 35,30 50,0",
      color: "red",
    },
    {
      id: 2,
      type: "polyline",
      data: "50,0 65,30 95,35 75,55 80,85 50,70 20,85 25,55 5,35 35,30 50,0",
      color: "green",
    },
  ]);

  const handleAddSticker = (sticker: Sticker) => {
    setStickers([...stickers, sticker]);
  };

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
    <GestureHandlerRootView style={styles.container}>
      <EditorCanvas
        imageSource={richmond}
        ref={viewShotRef}
        stickers={stickers}
      />
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
    </GestureHandlerRootView>
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
});

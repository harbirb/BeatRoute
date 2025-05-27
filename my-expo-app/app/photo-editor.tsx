import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Image, Button, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef, useState } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as ImagePicker from "expo-image-picker";
import { StickerModal } from "@/components/StickerModal";
import { EditorCanvas } from "@/components/EditorCanvas";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Sticker {
  id: string;
  type: "polyline" | "text" | "map";
  data: string;
  thickness: number;
  font?: string;
  color: string;
}

const notfoundimage = require("../assets/images/IMG_1014.jpg");

export default function PhotoEditor() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const viewShotRef = useRef<ViewShot>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const { imageUri } = useLocalSearchParams();

  const handleAddSticker = (sticker: Sticker) => {
    setStickers([...stickers, sticker]);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
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

  const handleStickerUpdate = (id: string, changes: any) => {
    setStickers((prev) =>
      prev.map((sticker) => {
        return sticker.id == id ? { ...sticker, ...changes } : sticker;
      })
    );
  };

  const handleStickerRemove = (id: string) => {
    setStickers((prev) => prev.filter((sticker) => sticker.id !== id));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {selectedImage ? (
        <EditorCanvas
          imageSource={selectedImage ? { uri: selectedImage } : notfoundimage}
          ref={viewShotRef}
          stickers={stickers}
          onStickerUpdate={handleStickerUpdate}
          onStickerRemove={handleStickerRemove}
        />
      ) : (
        <View style={styles.defaultView}>
          <Pressable onPress={pickImageAsync} style={styles.choosePhotoButton}>
            <Text style={styles.choosePhotoText}>Choose Photo</Text>
          </Pressable>
        </View>
      )}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="black" />
      </Pressable>
      {selectedImage && (
        <Pressable
          style={styles.stickerButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="sticker-emoji"
            size={24}
            color="black"
          />
        </Pressable>
      )}
      {selectedImage && (
        <Pressable style={styles.shareButton} onPress={() => handleShare()}>
          <Ionicons name="share-social" size={24} color="black" />
        </Pressable>
      )}
      <StickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddSticker={handleAddSticker}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
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
  defaultView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  choosePhotoButton: {
    width: 320,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    backgroundColor: "dodgerblue",
    borderRadius: 20,
  },
  choosePhotoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

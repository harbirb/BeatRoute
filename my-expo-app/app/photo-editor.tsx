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
  const viewShotRef = useRef<ViewShot>(null);
  const [stickers, setStickers] = useState<Sticker[]>([
    // {
    //   id: "1",
    //   type: "map",
    //   data: "}ntkH~u~nVCCwAAs@Gc@?]EaBLM?CB}@@]CGEQk@o@By@Ag@D}ADIAEECQ?aCPiJ?{@BeA?gADgCBkCJeDAoCDsDEmJDuBCu@Dk@EiAEU?sAHmAf@}DQ[M_@Ms@EeA@w@Cq@Bm@@yCF}@@gAEaBDo@CsBHaBFaC?mDGw@PmDHcDCuADwEGaBFk@AyCGmBDi@Aw@FwGAoBJyBEc@Aq@@s@EIKAwCF]AWCu@BSCqADa@CcBBa@EkAAMOIs@?wDDgIQG?jCDTFB|BVj@JdBDj@CdBBp@Dz@C~@Bd@ADFDf@DdBCdEEx@@`E@v@C~@?tCEnABbB?xDC~@?rCIdLCxAEV?tCDz@ExABr@EX?rCGdE?dGI|C@jAAxADl@GZ?f@@b@Lj@b@l@YnASxAItB@|AG|ADvAM`UAbGC~EE~ABxDOnI@nAD\\Tb@JHjBDh@A^B`A?d@BfACnAFlAA",
    //   color: "red",
    //   thickness: 2,
    // },
  ]);
  const { imageUri } = useLocalSearchParams();

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

  // usePreventRemove(true, () => {
  //   alert("Are you sure you want to leave?");
  // });

  return (
    <GestureHandlerRootView style={styles.container}>
      <EditorCanvas
        imageSource={imageUri ? { uri: imageUri } : notfoundimage}
        ref={viewShotRef}
        stickers={stickers}
        onStickerUpdate={handleStickerUpdate}
        onStickerRemove={handleStickerRemove}
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

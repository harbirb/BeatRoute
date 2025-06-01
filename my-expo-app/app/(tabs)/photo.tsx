import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Clipboard from "expo-clipboard";
import { mockActivityData } from "@/mockActivityData";

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import ClipboardSticker from "@/components/ClipboardSticker";
import generateStickers from "@/utils/generateStickers";
import { TextSticker } from "@/components/TextSticker";
import { PolylineSticker } from "@/components/PolylineSticker";
import { supabase } from "@/lib/supabase";
import { mockActivityData2 } from "@/mockActivityData2";
import ClipboardStickerGrid from "@/components/ClipboardStickerGrid";

const PlaceholderImage = require("@/assets/images/IMG_1014.jpg");

type StickerObject = {
  id: string;
  name: string;
  stickers: any[];
};

export default function Index() {
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const [stickers, setStickers] = useState<any[]>([]);
  // save styling preferences to users local device
  // fetch styling preferences from users local device
  const [styling, setStyling] = useState<any>(null);

  useEffect(() => {
    // const activities = mockActivityData;

    const populateStickers = async () => {
      // const { data, error } = await supabase.functions.invoke(
      //   "get-recent-activity"
      // );
      const data = mockActivityData2;

      const newStickers: any[] = [];
      for (const activity of data) {
        const activityStickers = generateStickers(activity);
        newStickers.push({
          id: activity.id,
          name: activity.name,
          stickers: activityStickers,
        });
      }
      // console.log(newStickers);
      setStickers(newStickers);
    };
    populateStickers();
  }, []);

  // useEffect(() => {
  //   if (showToast) {
  //     setTimeout(() => {
  //       setShowToast(false);
  //     }, 1500);
  //   }
  // }, [showToast]);

  const launchPhotoEditor = () => {
    router.push({
      pathname: "/photo-editor",
    });
  };

  return (
    <View style={styles.container}>
      {showToast && (
        <View style={styles.toast}>
          <Text style={{ fontFamily: "Inter", fontWeight: "bold" }}>
            Copied!
          </Text>
        </View>
      )}
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => launchPhotoEditor()}
          style={{
            backgroundColor: "dodgerblue",
            padding: 10,
            borderRadius: 18,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Launch Editor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            alert("TODO");
          }}
          style={{
            backgroundColor: "dodgerblue",
            padding: 10,
            borderRadius: 18,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Customize Stickers
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: "white",
          fontSize: 20,
          margin: 10,
          textAlign: "center",
          fontFamily: "Inter",
          fontWeight: "bold",
        }}
      >
        Tap to copy a sticker
      </Text>
      {stickers.length > 0 && (
        <FlatList
          data={stickers}
          renderItem={({ item }) => {
            return <ClipboardStickerGrid stickerData={item} />;
          }}
        />
      )}
    </View>
  );
}

function drawSticker(item: any) {
  console.log(item.type);
  return (
    <ClipboardSticker>
      {item.type === "text" && (
        <TextSticker
          stickerData={{
            caption: item.caption,
            data: item.data,
            color: "white",
            thickness: 8,
          }}
          scale={0.6}
        />
      )}
      {item.type === "polyline" && (
        <PolylineSticker
          stickerData={{
            data: item.data,
            color: "#fc4c02",
            thickness: 5,
          }}
          scale={1}
        />
      )}
    </ClipboardSticker>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    flex: 1,
  },
  toast: {
    position: "absolute",
    top: 100,
    zIndex: 9999,
    justifyContent: "center",
    backgroundColor: "gainsboro",
    padding: 20,
    borderRadius: 10,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 50,
  },
  stickerContainer: {
    // alignItems: "center",
    // justifyContent: "center",
    // gap: 30,
  },
});

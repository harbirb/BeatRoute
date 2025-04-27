import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import Modal from "react-native-modal";
import { PolylineSticker } from "./PolylineSticker";
import { supabase } from "../lib/supabase";
import polyline from "@mapbox/polyline";
import { TextSticker } from "./TextSticker";
import { mockActivityData } from "@/mockActivityData";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddSticker: (sticker: Sticker) => void;
};

interface SummaryActivity {
  type: string;
  average_speed: any;
  average_heartrate: any;
  map: any;
  total_elevation_gain: any;
  id: number;
  distance: number;
  moving_time: number;
}

const defaultPolylineColor = "#fc4c02";
const defaultPolylineThickness = 5;
const defaultTextColor = "#ffffff";
const defaultTextThickness = 5;
const defaultTextFont = "Arial";

interface Sticker {
  id: string;
  type: "polyline" | "text";
  data: string;
  color: string;
  font?: string;
  thickness: number;
}

function processMovingTime(movingTime: number): string {
  const hours = Math.floor(movingTime / 3600);
  const minutes = Math.floor((movingTime % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

const createTextSticker = (id: string, data: string): Sticker => ({
  id,
  type: "text",
  data,
  color: defaultTextColor,
  thickness: defaultTextThickness,
  font: defaultTextFont,
});

const createTextStickers = (activity: SummaryActivity): Sticker[] => {
  const textStickers: Sticker[] = [];
  if (activity.distance) {
    textStickers.push(
      createTextSticker(
        activity.id.toString() + "distance",
        (activity.distance / 1000).toFixed(1) + " km"
      )
    );
  }
  if (activity.moving_time) {
    textStickers.push(
      createTextSticker(
        activity.id.toString() + "moving_time",
        processMovingTime(activity.moving_time)
      )
    );
  }
  if (activity.total_elevation_gain) {
    textStickers.push(
      createTextSticker(
        activity.id.toString() + "total_elevation_gain",
        activity.total_elevation_gain.toFixed(0) + " m"
      )
    );
  }
  if (activity.average_heartrate) {
    textStickers.push(
      createTextSticker(
        activity.id.toString() + "average_heartrate",
        activity.average_heartrate.toFixed(0) + " bpm"
      )
    );
  }
  if (activity.average_speed) {
    const kmh = activity.average_speed * 3.6;
    const pace = 60 / kmh;
    textStickers.push(
      createTextSticker(
        activity.id.toString() + "average_speed",
        activity.type === "Run"
          ? `${pace.toFixed(0)}:${((pace % 1) * 60).toFixed(0)} /km`
          : `${kmh.toFixed(1)} km/h`
      )
    );
  }
  return textStickers;
};

const createPolylineSticker = (activity: SummaryActivity): Sticker => ({
  id: activity.id.toString() + "polyline",
  type: "polyline",
  data: activity.map.summary_polyline,
  color: defaultPolylineColor,
  thickness: defaultPolylineThickness,
});

export const StickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onAddSticker,
}) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [stickers, setStickers] = useState<Sticker[]>([
    {
      id: "223",
      type: "text",
      data: "106.22 km",
      color: "white",
      font: "Arial",
      thickness: 5,
    },
  ]);

  useEffect(() => {
    //   supabase.functions.invoke("get-recent-activity").then(({ data }) => {
    //     const newStickers: Sticker[] = [];
    //     data.forEach((SummaryActivity: any) => {
    //       newStickers.push(...createTextStickers(SummaryActivity));
    //       newStickers.push(createPolylineSticker(SummaryActivity));
    //     });
    //     setStickers((prev) => [...prev, ...newStickers]);
    //   });

    const data = mockActivityData;
    const newStickers: Sticker[] = [];
    data.forEach((SummaryActivity: any) => {
      newStickers.push(createPolylineSticker(SummaryActivity));
      newStickers.push(...createTextStickers(SummaryActivity));
    });
    setStickers((prev) => [...newStickers, ...prev]);
  }, []);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeThreshold={100}
      // todo: allow scroling in modal without closign it
      onSwipeComplete={onClose}
      swipeDirection={isScrollEnabled ? [] : "down"}
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
    >
      <View style={styles.modalView}>
        <View
          style={{
            width: 40,
            height: 5,
            backgroundColor: "#ccc",
            borderRadius: 99,
            marginBottom: 20,
          }}
        />
        <FlatList
          data={stickers}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onAddSticker({ ...item, id: (Math.random() * 100).toString() });
                onClose();
              }}
              style={{
                width: 150,
                backgroundColor: "gray",
              }}
            >
              {item.type === "polyline" ? (
                <PolylineSticker stickerData={item} scale={0.3} />
              ) : (
                <TextSticker stickerData={item} scale={0.4} />
              )}
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          ItemSeparatorComponent={() => (
            <View style={{ height: 20, width: 20 }} />
          )}
          style={{ padding: 20 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            columnGap: 20,
          }}
          onScrollBeginDrag={() => {
            setIsScrollEnabled(true);
          }}
          onScrollEndDrag={() => {
            setIsScrollEnabled(false);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});

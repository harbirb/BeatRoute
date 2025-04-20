import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import Modal from "react-native-modal";
import { PolylineSticker } from "./PolylineSticker";
import { supabase } from "../lib/supabase";
import polyline from "@mapbox/polyline";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddSticker: (sticker: Sticker) => void;
};

interface Sticker {
  id: number;
  type: "polyline" | "text";
  data: string;
  color: string;
}

export const StickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onAddSticker,
}) => {
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
    {
      id: 3,
      type: "polyline",
      data: "50,0 65,30 95,35 75,55 80,85 50,70 20,85 25,55 5,35 35,30 50,0",
      color: "blue",
    },
    {
      id: 4,
      type: "polyline",
      data: "50,0 65,30 95,35 75,55 80,85 50,70 20,85 25,55 5,35 35,30 50,0",
      color: "green",
    },
    {
      id: 6,
      type: "polyline",
      data: processPolyline(
        "}ntkH~u~nVCCwAAs@Gc@?]EaBLM?CB}@@]CGEQk@o@By@Ag@D}ADIAEECQ?aCPiJ?{@BeA?gADgCBkCJeDAoCDsDEmJDuBCu@Dk@EiAEU?sAHmAf@}DQ[M_@Ms@EeA@w@Cq@Bm@@yCF}@@gAEaBDo@CsBHaBFaC?mDGw@PmDHcDCuADwEGaBFk@AyCGmBDi@Aw@FwGAoBJyBEc@Aq@@s@EIKAwCF]AWCu@BSCqADa@CcBBa@EkAAMOIs@?wDDgIQG?jCDTFB|BVj@JdBDj@CdBBp@Dz@C~@Bd@ADFDf@DdBCdEEx@@`E@v@C~@?tCEnABbB?xDC~@?rCIdLCxAEV?tCDz@ExABr@EX?rCGdE?dGI|C@jAAxADl@GZ?f@@b@Lj@b@l@YnASxAItB@|AG|ADvAM`UAbGC~EE~ABxDOnI@nAD\\Tb@JHjBDh@A^B`A?d@BfACnAFlAA"
      ),
      color: "red",
    },
  ]);

  // useEffect(() => {
  //   supabase.functions.invoke("get-recent-activity").then(({ data }) => {
  //     data.forEach((SummaryActivity: any) => {
  //       setStickers([
  //         ...stickers,
  //         {
  //           id: SummaryActivity.map.id,
  //           type: "polyline",
  //           data: processPolyline(SummaryActivity.map.summary_polyline),
  //           color: "green",
  //         },
  //       ]);
  //     });
  //   });
  // }, []);

  function processPolyline(encodedPolyline: string) {
    const DEFAULT_SIZE = 100;
    const coords = polyline.decode(encodedPolyline);
    const minLat = Math.min(...coords.map((c) => c[0]));
    const maxLat = Math.max(...coords.map((c) => c[0]));
    const minLng = Math.min(...coords.map((c) => c[1]));
    const maxLng = Math.max(...coords.map((c) => c[1]));

    const mapWidth = maxLng - minLng;
    const mapHeight = maxLat - minLat;
    const maxSize = Math.max(mapWidth, mapHeight);

    // TODO: scale to fit square properly
    const normCoords = coords.map(([lat, lng]) => ({
      x: ((lng - minLng) / maxSize) * DEFAULT_SIZE,
      y: ((maxLat - lat) / maxSize) * DEFAULT_SIZE,
    }));
    return normCoords.map((p) => `${p.x},${p.y}`).join(" ");
  }

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeThreshold={100}
      // todo: allow scroling in modal without closign it
      onSwipeComplete={onClose}
      swipeDirection="down"
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
                onAddSticker({ ...item, id: Math.random() * 100 });
                onClose();
              }}
            >
              <PolylineSticker
                points={item.data}
                color={item.color}
                scale={0.3}
              />
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
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

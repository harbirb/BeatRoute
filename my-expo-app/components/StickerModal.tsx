import { useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import Modal from "react-native-modal";
import { PolylineSticker } from "./PolylineSticker";

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
  ]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
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
                console.log(item);
                onAddSticker({ ...item, id: Math.random() * 100 });
                onClose();
              }}
            >
              <View>
                <PolylineSticker
                  points={item.data}
                  color={item.color}
                  scale={0.2}
                />
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
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

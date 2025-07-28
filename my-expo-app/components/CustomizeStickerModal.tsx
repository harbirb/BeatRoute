import Modal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ClipboardSticker from "./ClipboardSticker";
import { PolylineSticker } from "./PolylineSticker";
import ColorPicker from "./ColorPicker";
import Slider from "@react-native-community/slider";

type Props = {
  visible: boolean;
  onClose: () => void;
  styling: any;
  setStyling: (styles: any) => void;
  sampleStickers: any[];
};

export default function CustomizeStickerModal({
  visible,
  onClose,
  styling,
  setStyling,
  sampleStickers,
}: Props) {
  const setColor = (color: string) => {
    setStyling({ ...styling, lineColor: color });
  };

  const updateStyling = (key: string, value: any) => {
    setStyling({ ...styling, [key]: value });
  };
  // console.log(sampleStickers);
  const polylineImage = sampleStickers.find((s) => s.type === "polyline");
  const textImage = sampleStickers.find((s) => s.type === "text");

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View style={styles.modalContainer}>
        {polylineImage && drawPolyline(polylineImage, styling)}
        <TouchableOpacity
          onPress={() => setStyling({ ...styling, lineColor: "red" })}
        >
          <Text>Select a Color</Text>
        </TouchableOpacity>
        <ColorPicker setColor={setColor} currentColor={styling.lineColor} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text>Line Width:</Text>
          <Slider
            value={styling.lineWidth}
            minimumValue={1}
            maximumValue={10}
            step={1}
            onValueChange={(value) => updateStyling("lineWidth", value)}
            style={{ width: 200, height: 40 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    height: "75%",
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },
});

function drawPolyline(item: any, styling: any) {
  return (
    <ImageBackground
      style={{
        width: 300,
        height: 300,
        overflow: "hidden",
        borderRadius: 30,
        borderColor: "#fc4c02",
        borderWidth: 2,
      }}
      source={require("../assets/images/tinycbdark.png")}
      resizeMode="repeat"
    >
      <ClipboardSticker>
        <PolylineSticker
          stickerData={{
            data: item.data,
            color: styling.lineColor,
            thickness: styling.lineWidth,
          }}
          scale={0.72}
        />
      </ClipboardSticker>
    </ImageBackground>
  );
}

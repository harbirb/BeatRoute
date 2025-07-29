import Modal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
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
    setStyling({ ...styling, lineColor: color, textColor: color });
  };

  const updateStyling = (key: string, value: any) => {
    setStyling({ ...styling, [key]: value });
  };
  // console.log(sampleStickers);
  const polylineImage = sampleStickers.find((s) => s.type === "polyline");
  const textImage = sampleStickers.find((s) => s.type === "text");

  const handleFontChange = (textFont: string) => {
    setStyling({ ...styling, textFont });
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View style={styles.modalContainer}>
        {/* {polylineImage && drawPolyline(polylineImage, styling)} */}
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
        {/* TODO: refactor this into textpicker component */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Pressable onPress={() => handleFontChange("PermanentMarker")}>
            <Text style={{ fontFamily: "PermanentMarker" }}>Marker</Text>
          </Pressable>
          <Pressable onPress={() => handleFontChange("Times New Roman")}>
            <Text style={{ fontFamily: "Times New Roman" }}>Times</Text>
          </Pressable>
          <Pressable onPress={() => handleFontChange("Arial")}>
            <Text style={{ fontFamily: "Arial" }}>Arial</Text>
          </Pressable>
          <Pressable onPress={() => handleFontChange("Comic Sans MS")}>
            <Text style={{ fontFamily: "Comic Sans MS" }}>Comic</Text>
          </Pressable>
          <Pressable onPress={() => handleFontChange("Courier")}>
            <Text style={{ fontFamily: "Courier" }}>Courier</Text>
          </Pressable>
          <Pressable onPress={() => handleFontChange("Helvetica")}>
            <Text style={{ fontFamily: "Helvetica" }}>Helvetica</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    height: "30%",
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

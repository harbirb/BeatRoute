import Modal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Switch,
} from "react-native";
import ClipboardSticker from "./ClipboardSticker";
import { PolylineSticker } from "./PolylineSticker";
import ColorPicker from "./ColorPicker";
import Slider from "@react-native-community/slider";
import FontPicker from "./FontPicker";
import ToggleButton from "./ToggleButton";

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
        <FontPicker
          setFont={(font: string) => updateStyling("textFont", font)}
          currentFont={styling.textFont}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          <ToggleButton
            value={styling.textStyle}
            activeValue="italic"
            inactiveValue="normal"
            onChange={(value: string) => updateStyling("textStyle", value)}
            label="Italic"
          />
          <ToggleButton
            value={styling.textWeight}
            activeValue="bold"
            inactiveValue="normal"
            onChange={(value: string) => updateStyling("textWeight", value)}
            label="Bold"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    // height: "30%",
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    paddingBottom: 60,
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

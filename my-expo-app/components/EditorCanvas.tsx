import { forwardRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ViewShot from "react-native-view-shot";
import { StickerWrapper } from "./StickerWrapper";
import { PolylineSticker } from "./PolylineSticker";

type EditorCanvasProps = {
  imageSource: any;
  stickers: any[];
};

export const EditorCanvas = forwardRef<ViewShot, EditorCanvasProps>(
  ({ imageSource, stickers }, ref) => {
    return (
      <ViewShot
        ref={ref}
        style={styles.imageContainer}
        options={{ format: "jpg", quality: 1 }}
      >
        <Image source={imageSource} style={styles.image} />
        {/* <Svg width="100%" height="100%" style={{ position: "absolute" }}>
          <Circle cx="50%" cy="50%" r="3%" fill="red" />
        </Svg> */}
        <View style={{ position: "absolute" }}>
          <StickerWrapper initialX={50} initialY={50}>
            <PolylineSticker
              points="50,0 65,30 95,35 75,55 80,85 50,70 20,85 25,55 5,35 35,30 50,0"
              color="green"
            />
          </StickerWrapper>
        </View>
      </ViewShot>
    );
  }
);

const styles = StyleSheet.create({
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
});

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
        <View style={{ position: "absolute" }}>
          {stickers.map((sticker) => {
            console.log(sticker.id);
            return (
              <StickerWrapper initialX={0} initialY={0} key={sticker.id}>
                <PolylineSticker points={sticker.data} color={sticker.color} />
              </StickerWrapper>
            );
          })}
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

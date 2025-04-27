import { forwardRef, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import ViewShot from "react-native-view-shot";
import { StickerWrapper } from "./StickerWrapper";
import { PolylineSticker } from "./PolylineSticker";
import { TextSticker } from "./TextSticker";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { EditorToolbar } from "./EditorToolbar";

type EditorCanvasProps = {
  imageSource: any;
  stickers: any[];
  onStickerUpdate: (id: string, changes: any) => void;
};

export const EditorCanvas = forwardRef<ViewShot, EditorCanvasProps>(
  ({ imageSource, stickers, onStickerUpdate }, ref) => {
    const [selectedStickerId, setSelectedStickerId] = useState(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
    const selectedSticker = useMemo(
      () => stickers.find((s) => s.id === selectedStickerId),
      [stickers, selectedStickerId]
    );

    const backGroundTap = Gesture.Tap()
      .onStart(() => {
        setSelectedStickerId(null);
      })
      .runOnJS(true);

    return (
      <ViewShot
        ref={ref}
        style={styles.imageContainer}
        options={{ format: "jpg", quality: 1 }}
      >
        <Image source={imageSource} style={styles.image} />
        <GestureDetector gesture={backGroundTap}>
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {stickers.map((sticker) => {
              const isSelected = sticker.id === selectedStickerId;
              const stickerTap = Gesture.Tap()
                .onStart(() => {
                  setSelectedStickerId(sticker.id);
                  setIsToolbarVisible(true);
                })
                .runOnJS(true);
              return (
                <GestureDetector key={sticker.id} gesture={stickerTap}>
                  <StickerWrapper isSelected={isSelected}>
                    {sticker.type === "polyline" ? (
                      <PolylineSticker stickerData={sticker} />
                    ) : (
                      <TextSticker stickerData={sticker} />
                    )}
                  </StickerWrapper>
                </GestureDetector>
              );
            })}
          </View>
        </GestureDetector>
        {selectedStickerId && isToolbarVisible && (
          <EditorToolbar
            color={selectedSticker.color}
            thickness={selectedSticker.thickness}
            onChangeColor={(newColor) =>
              onStickerUpdate(selectedStickerId, { color: newColor })
            }
            onChangeThickness={(newThickness) =>
              onStickerUpdate(selectedStickerId, { thickness: newThickness })
            }
            onClose={() => {
              setIsToolbarVisible(false);
            }}
          />
        )}
      </ViewShot>
    );
  }
);

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: "100%",
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

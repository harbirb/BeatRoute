import { forwardRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ViewShot from "react-native-view-shot";

type EditorCanvasProps = {
  imageSource: any;
};

export const EditorCanvas = forwardRef<ViewShot, EditorCanvasProps>(
  ({ imageSource }, ref) => {
    return (
      <ViewShot
        ref={ref}
        style={styles.imageContainer}
        options={{ format: "jpg", quality: 1 }}
      >
        <Image source={imageSource} style={styles.image} />
        <Svg width="100%" height="100%" style={{ position: "absolute" }}>
          <Circle cx="50%" cy="50%" r="3%" fill="red" />
        </Svg>
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

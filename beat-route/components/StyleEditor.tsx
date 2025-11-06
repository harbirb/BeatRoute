import { Text, View, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { StickerStyle } from "./Stickers";
import { FONT_WEIGHT, SPACING } from "@/constants/theme";

type StyleEditorProps = {
  style: StickerStyle;
  setStyle: (style: StickerStyle) => void;
};

const fontWeights = Object.keys(FONT_WEIGHT) as (keyof typeof FONT_WEIGHT)[];

export default function StyleEditor({ style, setStyle }: StyleEditorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Font Weight</Text>
        <View style={styles.fontWeightContainer}>
          {fontWeights.map((weight) => (
            <Pressable
              key={weight}
              style={[
                styles.fontWeightButton,
                style.fontWeight === FONT_WEIGHT[weight] &&
                  styles.selectedFontWeightButton,
              ]}
              onPress={() =>
                setStyle({ ...style, fontWeight: FONT_WEIGHT[weight] })
              }
            >
              <Text style={styles.fontWeightButtonText}>{weight}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Stroke Width</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={style.strokeWidth}
          onValueChange={(value) => setStyle({ ...style, strokeWidth: value })}
          minimumTrackTintColor="#FFFFFF"
        />
      </View>
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Font Size</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={50}
          step={1}
          value={style.fontSize}
          onValueChange={(value) => setStyle({ ...style, fontSize: value })}
          minimumTrackTintColor="#FFFFFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.medium,
    backgroundColor: "#ddd",
  },
  controlContainer: {
    marginBottom: SPACING.medium,
  },
  label: {
    marginBottom: SPACING.small,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  fontWeightContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: SPACING.small,
  },
  fontWeightButton: {
    padding: SPACING.small,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
  },
  selectedFontWeightButton: {
    backgroundColor: "#bbb",
  },
  fontWeightButtonText: {
    color: "#000",
  },
});

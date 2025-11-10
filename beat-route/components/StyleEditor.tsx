import { Text, View, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { StickerStyle } from "./Stickers";
import { FONT_WEIGHT, SPACING } from "@/constants/theme";
import Card from "./ui/Card";

type StyleEditorProps = {
  style: StickerStyle;
  setStyle: (style: StickerStyle) => void;
};

const fontWeights = Object.keys(FONT_WEIGHT) as (keyof typeof FONT_WEIGHT)[];

export default function StyleEditor({ style, setStyle }: StyleEditorProps) {
  return (
    <Card>
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Font Weight</Text>
        <View
          style={[styles.fontWeightContainer, styles.propertyModifierContainer]}
        >
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
              <Text style={styles.fontWeightButtonText}>
                {weight.substring(0, 4)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Stroke Width</Text>
        <Slider
          style={[styles.slider, styles.propertyModifierContainer]}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={style.strokeWidth}
          onValueChange={(value) => setStyle({ ...style, strokeWidth: value })}
          minimumTrackTintColor="#aaa"
        />
      </View>
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Font Size</Text>
        <Slider
          style={[styles.slider, styles.propertyModifierContainer]}
          minimumValue={10}
          maximumValue={50}
          step={1}
          value={style.fontSize}
          onValueChange={(value) => setStyle({ ...style, fontSize: value })}
          minimumTrackTintColor="#aaa"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  controlContainer: {
    marginBottom: SPACING.medium,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
  },
  propertyModifierContainer: {
    flex: 2,
  },
  slider: {
    height: 40,
  },
  fontWeightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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

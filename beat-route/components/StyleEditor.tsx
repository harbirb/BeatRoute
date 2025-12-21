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

const weightLabels: Record<keyof typeof FONT_WEIGHT, string> = {
  regular: "Reg",
  medium: "Med",
  bold: "Bld",
  black: "Blk",
};

type ControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const SliderControl = ({ label, value, min, max, onChange }: ControlProps) => (
  <View style={styles.controlContainer}>
    <Text style={styles.label}>{label}</Text>
    <Slider
      style={[styles.slider, { flex: 2 }]}
      minimumValue={min}
      maximumValue={max}
      step={1}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor="#aaa"
    />
  </View>
);

const FontWeightControl = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (weight: string) => void;
}) => (
  <View style={styles.controlContainer}>
    <Text style={styles.label}>Font Weight</Text>
    <View style={[styles.fontWeightContainer, { flex: 2 }]}>
      {fontWeights.map((weight) => (
        <Pressable
          key={weight}
          style={[
            styles.fontWeightButton,
            value === FONT_WEIGHT[weight] && styles.selectedFontWeightButton,
          ]}
          onPress={() => onChange(FONT_WEIGHT[weight])}
        >
          <Text style={styles.fontWeightButtonText}>
            {weightLabels[weight]}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
);

export default function StyleEditor({ style, setStyle }: StyleEditorProps) {
  return (
    <Card>
      <FontWeightControl
        value={style.fontWeight}
        onChange={(weight) => setStyle({ ...style, fontWeight: weight })}
      />
      <SliderControl
        label="Stroke Width"
        value={style.strokeWidth}
        min={1}
        max={20}
        onChange={(value) => setStyle({ ...style, strokeWidth: value })}
      />
      <SliderControl
        label="Font Size"
        value={style.fontSize}
        min={10}
        max={50}
        onChange={(value) => setStyle({ ...style, fontSize: value })}
      />
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
  slider: {
    height: 40,
  },
  fontWeightContainer: {
    flexDirection: "row",
    gap: 6,
    flex: 2,
  },
  fontWeightButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
  },
  selectedFontWeightButton: {
    backgroundColor: "#bbb",
  },
  fontWeightButtonText: {
    fontSize: 11,
    color: "#000",
    textAlign: "center",
  },
});

import { View, StyleSheet } from "react-native";
import ColorPicker, { Panel5 } from "reanimated-color-picker";
import { StickerStyle } from "./Stickers";

type ColorEditorProps = {
  style: StickerStyle;
  setStyle: (style: StickerStyle) => void;
};

export default function ColorEditor({ style, setStyle }: ColorEditorProps) {
  return (
    <View style={styles.container}>
      <ColorPicker
        value={style.color}
        onChangeJS={(c) => {
          setStyle({ ...style, color: c.hex });
        }}
        style={styles.picker}
      >
        <Panel5 style={styles.panel} />
      </ColorPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  picker: {
    width: "95%",
  },
  panel: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});

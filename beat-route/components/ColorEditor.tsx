import { View } from "react-native";
import ColorPicker, { Panel5 } from "reanimated-color-picker";
import { StickerStyle } from "./Stickers";

type ColorEditorProps = {
  style: StickerStyle;
  setStyle: (style: StickerStyle) => void;
};

export default function ColorEditor({ style, setStyle }: ColorEditorProps) {
  return (
    <View>
      <ColorPicker
        value={style.color}
        onChangeJS={(c) => {
          setStyle({ ...style, color: c.hex });
        }}
      >
        <Panel5 />
      </ColorPicker>
    </View>
  );
}

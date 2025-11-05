import { Text, View } from "react-native";
import { StickerStyle } from "./Stickers";

type StyleEditorProps = {
  style: StickerStyle;
  setStyle: (style: StickerStyle) => void;
};
export default function StyleEditor({ style, setStyle }: StyleEditorProps) {
  return (
    <View>
      <Text>Style Editor</Text>
    </View>
  );
}

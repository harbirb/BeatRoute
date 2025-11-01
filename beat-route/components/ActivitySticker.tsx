import { useRef, type PropsWithChildren } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  type ViewProps,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Clipboard from "expo-clipboard";

type ActivityStickerProps = PropsWithChildren<{
  children: React.ReactNode;
  style?: ViewProps["style"];
}>;

export default function ActivitySticker({
  children,
  style,
}: ActivityStickerProps) {
  const stickerRef = useRef<View>(null);

  const handleCopy = async () => {
    if (!stickerRef.current) return;

    try {
      const uri = await captureRef(stickerRef, {
        format: "png",
        result: "base64",
      });
      await Clipboard.setImageAsync(uri);
      Alert.alert("Copied!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error!", "Failed to copy image to clipboard.");
    }
  };

  return (
    <Pressable
      onPress={handleCopy}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        styles.container,
      ]}
    >
      <ViewShot ref={stickerRef}>
        <View style={style}>{children}</View>
      </ViewShot>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
  },
});

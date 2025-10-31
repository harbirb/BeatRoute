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
  style?: ViewProps["style"];
}>;

export default function ActivitySticker({ children }: ActivityStickerProps) {
  const ref = useRef<View>(null);

  const handleCopy = async () => {
    try {
      const uri = await captureRef(ref, {
        format: "png",
        quality: 1,
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
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <ViewShot ref={ref} style={styles.container}>
        {children}
      </ViewShot>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 2,
    borderColor: "black",
  },
});

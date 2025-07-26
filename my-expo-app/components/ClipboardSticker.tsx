import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Clipboard from "expo-clipboard";

type Props = {
  children: any;
};

export default function ClipboardSticker({ children }: Props) {
  const ref = useRef<View>(null);

  const handleCopy = async () => {
    const uri = await captureRef(ref, {
      format: "png",
      quality: 1,
      result: "base64",
    });
    await Clipboard.setImageAsync(uri);
    Alert.alert("Copied");
    console.log("copied");
  };

  return (
    <Pressable
      onPress={handleCopy}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        styles.container,
      ]}
    >
      <ViewShot ref={ref}>{children}</ViewShot>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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
    alert("Sticker copied to clipboard!");
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleCopy}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          styles.stickerContainer,
        ]}
      >
        <ViewShot ref={ref}>{children}</ViewShot>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  stickerContainer: {
    // backgroundColor: "gainsboro",
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "gainsboro",
    borderWidth: 1,
  },
});

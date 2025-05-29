import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  TouchableOpacity,
  Text,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Clipboard from "expo-clipboard";

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

const PlaceholderImage = require("@/assets/images/IMG_1014.jpg");

export default function Index() {
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const ref = useRef<View>(null);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
    }
  }, [showToast]);

  const launchPhotoEditor = () => {
    router.push({
      pathname: "/photo-editor",
    });
  };

  return (
    <View style={styles.container}>
      {showToast && (
        <View style={styles.toast}>
          <Text>Copied!</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => launchPhotoEditor()}
        style={{ backgroundColor: "#2196F3", padding: 12, borderRadius: 18 }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Launch Editor
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          console.log("COPYING");
          const uri = await captureRef(ref, {
            format: "png",
            result: "base64",
          });
          console.log("saved image uri:");
          await Clipboard.setImageAsync(uri);
          setShowToast(true);
        }}
      >
        <ViewShot ref={ref}>
          <Text style={{ fontSize: 90, color: "red" }}>ViewShot</Text>
        </ViewShot>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  toast: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
});

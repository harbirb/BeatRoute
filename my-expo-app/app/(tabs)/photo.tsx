import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  TouchableOpacity,
  Text,
} from "react-native";
import TestMap from "@/components/TestMap";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useRouter } from "expo-router";

const PlaceholderImage = require("@/assets/images/IMG_1014.jpg");

export default function Index() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      router.push({
        pathname: "/photo-editor",
        params: { imageUri: result.assets[0].uri },
      });
    } else {
      alert("You did not select any image.");
    }
  };

  function handleLayout(event: LayoutChangeEvent): void {
    const { width, height } = event.nativeEvent.layout;
    setCanvasDimensions({ width, height });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => pickImageAsync()}
        style={{ backgroundColor: "#2196F3", padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 25, textAlign: "center" }}>
          Edit Photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    height: "100%",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

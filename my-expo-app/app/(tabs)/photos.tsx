import { View, StyleSheet } from "react-native";
import TestMap from "@/components/TestMap";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import MapSticker from "@/components/MapSticker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PlaceholderImage = require("@/assets/images/react-logo.png");

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      //   console.log(result);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
        <MapSticker />
      </View>
      <View style={styles.footerContainer}>
        <Button label="choose a photo" onPress={pickImageAsync}></Button>
        <Button label="use this photo"></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "red",
    // paddingTop: 28,
    // alignItems: "center",
  },
  stickerContainer: {
    position: "absolute",
    top: 50,
    left: 50,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

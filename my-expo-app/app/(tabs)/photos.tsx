import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import TestMap from "@/components/TestMap";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import MapSticker from "@/components/MapSticker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const PlaceholderImage = require("@/assets/images/react-logo.png");

export default function Index() {
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
      //   console.log(result);
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
      <View style={styles.imageContainer} onLayout={handleLayout}>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
        <MapSticker canvasSize={canvasDimensions} />
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

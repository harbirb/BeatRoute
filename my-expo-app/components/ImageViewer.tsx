import { StyleSheet, View, Image as RNImage } from "react-native";
import { Image, type ImageSource } from "expo-image";

type Props = {
  imgSource: ImageSource;
  selectedImage?: String;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage
    ? ({ uri: selectedImage } as ImageSource)
    : imgSource;

  return (
    <Image source={imageSource} style={styles.image} contentFit="contain" />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

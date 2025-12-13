import { useRef, useState } from "react";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { View, Text } from "react-native";
import ActivitySticker from "./ActivitySticker";
import { ImageBackground } from "expo-image";
const TransparencyMid120 = require("../assets/images/TransparencyMid120.png");

export default function CarouselComponent({ data }: { data: any[] }) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [width, setWidth] = useState(10);

  return (
    <View
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
      style={{}}
    >
      <ImageBackground
        source={TransparencyMid120}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Carousel
          ref={ref}
          width={width}
          height={width}
          enabled={width > 0}
          data={data}
          onProgressChange={progress}
          renderItem={({ index }) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivitySticker>{data[index]}</ActivitySticker>
            </View>
          )}
        />
      </ImageBackground>

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{
          backgroundColor: "lightgray",
          borderRadius: 10,
        }}
        activeDotStyle={{ backgroundColor: "gray", borderRadius: 20 }}
        containerStyle={{ gap: 5, marginTop: 5 }}
      />
    </View>
  );
}

import { useRef, useState } from "react";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { View, Text } from "react-native";
import ActivitySticker from "./ActivitySticker";

export default function CarouselComponent({ data }: { data: any[] }) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [width, setWidth] = useState(1);

  return (
    <View
      style={{ flex: 1, backgroundColor: "orange" }}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
    >
      <Carousel
        ref={ref}
        width={width}
        // height={width / 2}
        enabled={width > 0}
        data={data}
        onProgressChange={progress}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivitySticker key={index}>
              <Text>{data[index]}</Text>
            </ActivitySticker>
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{
          backgroundColor: "lightgray",
          borderRadius: 10,
        }}
        activeDotStyle={{ backgroundColor: "gray", borderRadius: 20 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
      />
    </View>
  );
}

import ActivitySticker from "@/components/ActivitySticker";
import DistancePaceSticker from "@/components/DistancePaceSticker";
import { useData } from "@/context/DataContext";
import { Stack } from "expo-router";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Polyline from "@/components/Polyline";
import PagerView from "react-native-pager-view";
import { useSharedValue } from "react-native-reanimated";
import { useRef, useState } from "react";
import { Dimensions } from "react-native";
import {
  Alert,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

export default function StudioScreen() {
  const { activities, loading } = useData();
  const polylines = activities.map((act) => act.polyline || "");

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const data = [1, 2, 3];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      {/* TOOLBAR */}
      <View style={{ flex: 1 }}>
        <Carousel
          ref={ref}
          width={width}
          height={width / 2}
          data={data}
          onProgressChange={progress}
          renderItem={({ index }) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: "center",
              }}
            >
              <ActivitySticker>
                <Polyline encodedPolyline={polylines[index]}></Polyline>
              </ActivitySticker>
            </View>
          )}
        />

        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
          activeDotStyle={{ backgroundColor: "blue", borderRadius: 50 }}
          containerStyle={{ gap: 5, marginTop: 10 }}
          // onPress={onPressPagination}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

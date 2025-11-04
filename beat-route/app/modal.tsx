import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, Button } from "react-native";
import { Activity, useData } from "@/context/DataContext";
import Carousel from "@/components/Carousel";
import Stickers from "@/components/Stickers";
import ColorPicker, { Panel5 } from "reanimated-color-picker";
import { useState } from "react";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

export default function ActivityDetailModal() {
  const { id } = useLocalSearchParams();
  const { activities } = useData();
  const activity = activities.find((act: Activity) => act.id === id);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [color, setColor] = useState("#ff0000");

  const stickers = Stickers(activity!, color);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 20,
      }}
    >
      <Carousel data={stickers} />
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          title="Color Picker"
          onPress={() => setOpenColorPicker(!openColorPicker)}
        ></Button>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 30,
            backgroundColor: color,
            borderWidth: 3,
            borderColor: "gray",
          }}
        ></View>
      </View>
      <View>
        {openColorPicker && (
          <ColorPicker
            value={color}
            onChangeJS={(c) => {
              setColor(c.hex);
            }}
          >
            <Panel5 />
          </ColorPicker>
        )}
      </View>
    </View>
  );
}

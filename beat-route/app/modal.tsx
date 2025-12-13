import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, Button } from "react-native";
import { Activity, useData } from "@/context/DataContext";
import Carousel from "@/components/Carousel";
import Stickers from "@/components/Stickers";
import { useState } from "react";
import StyleEditor from "@/components/StyleEditor";
import ColorEditor from "@/components/ColorEditor";

export default function ActivityDetailModal() {
  const { id } = useLocalSearchParams();
  const { activities, stickerStyle, setStickerStyle } = useData();
  const activity = activities.find((act: Activity) => act.id === id);
  const [activeEditor, setActiveEditor] = useState<string>("Style");
  const stickers = Stickers(activity!, stickerStyle);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 16,
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
        <Button title="Style" onPress={() => setActiveEditor("Style")}></Button>
        <Button title="Color" onPress={() => setActiveEditor("Color")}></Button>
      </View>
      <View>
        {activeEditor === "Color" && (
          <ColorEditor style={stickerStyle} setStyle={setStickerStyle} />
        )}
        {activeEditor === "Style" && (
          <StyleEditor style={stickerStyle} setStyle={setStickerStyle} />
        )}
      </View>
    </View>
  );
}

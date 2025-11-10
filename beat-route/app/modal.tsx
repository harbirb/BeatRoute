import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, Button } from "react-native";
import { Activity, useData } from "@/context/DataContext";
import Carousel from "@/components/Carousel";
import Stickers, { StickerStyle } from "@/components/Stickers";
import ColorPicker, { Panel5 } from "reanimated-color-picker";
import { useState } from "react";
import StyleEditor from "@/components/StyleEditor";
import ColorEditor from "@/components/ColorEditor";
import Card from "@/components/ui/Card";

const initialStyle: StickerStyle = {
  color: "white",
  fontWeight: "normal",
  fontSize: 14,
  strokeWidth: 2,
};

export default function ActivityDetailModal() {
  const { id } = useLocalSearchParams();
  const { activities } = useData();
  const activity = activities.find((act: Activity) => act.id === id);
  const [activeEditor, setActiveEditor] = useState<string>("Style");
  const [style, setStyle] = useState<StickerStyle>(initialStyle);
  const stickers = Stickers(activity!, style);

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
          <ColorEditor style={style} setStyle={setStyle} />
        )}
        {activeEditor === "Style" && (
          <StyleEditor style={style} setStyle={setStyle} />
        )}
      </View>
    </View>
  );
}

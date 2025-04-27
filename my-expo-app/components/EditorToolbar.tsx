import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useState } from "react";

const COLORS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FFFFFF",
  "#000000",
];

type EditorToolbarProps = {
  color: string;
  thickness: number;
  onChangeColor: (color: string) => void;
  onChangeThickness: (thickness: number) => void;
  onClose: () => void;
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  color,
  thickness,
  onChangeColor,
  onChangeThickness,
  onClose,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "white",
        opacity: 0.7,
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: 30,
          width: 30,
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#000", fontSize: 14 }}>X</Text>
      </TouchableOpacity>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
        Edit Sticker
      </Text>

      {/* Color Picker */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
        }}
      >
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onChangeColor(c)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: c,
              borderWidth: color === c ? 2 : 0,
              borderColor: "black",
            }}
          />
        ))}
      </View>

      {/* Thickness Slider */}
      <View>
        <Text style={{ marginBottom: 8 }}>
          Thickness: {thickness.toFixed(1)}
        </Text>
        <Slider
          minimumValue={0.5}
          maximumValue={10}
          step={0.1}
          value={thickness}
          onValueChange={(value: number) => onChangeThickness(value)}
          minimumTrackTintColor="#333"
          maximumTrackTintColor="#aaa"
        />
      </View>
    </View>
  );
};

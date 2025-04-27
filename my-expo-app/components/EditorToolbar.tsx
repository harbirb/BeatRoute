import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useState } from "react";

const COLORS = [
  "#000000",
  "#FFFFFF",
  "#fc4c02",
  "#00a4e4",
  "#279b37",
  "#ff0000",
];

const FONTS = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
];

type EditorToolbarProps = {
  color: string;
  thickness: number;
  font?: string;
  onChangeColor: (color: string) => void;
  onChangeThickness: (thickness: number) => void;
  onChangeFont?: (font: string) => void;
  onClose: () => void;
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  color,
  thickness,
  onChangeColor,
  onChangeThickness,
  onClose,
  font,
  onChangeFont,
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
              borderWidth: color === c ? 2 : 1,
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

      {/* Font Picker */}
      {onChangeFont && (
        <View>
          <Text style={{ marginBottom: 8 }}>Font:</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around", // Distribute fonts evenly
              marginBottom: 8, // Adjust margin as needed
              flexWrap: "wrap", // Allow fonts to wrap to the next line
            }}
          >
            {FONTS.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => {
                  onChangeFont(f);
                }}
                style={{
                  width: 80, // Give each font a fixed width
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: font === f ? "#ddd" : "transparent", // Highlight selected
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 4, // Add some margin between font options
                }}
              >
                <Text style={{ fontFamily: f }}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

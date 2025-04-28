import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  onStickerRemove: () => void;
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  color,
  thickness,
  onChangeColor,
  onChangeThickness,
  onClose,
  font,
  onChangeFont,
  onStickerRemove,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "white",
        opacity: 0.8,
        borderRadius: 12,
        padding: 14,
      }}
    >
      {/* Toolbar Header (Trash Icon, Edit Text, Close Button) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginBottom: 14, // Add space between header and color picker
        }}
      >
        {/* Trash Icon (Top Left) */}
        <TouchableOpacity
          onPress={onStickerRemove}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>

        {/* "Edit" Text (Center) */}
        <Text
          style={{
            fontSize: 18,
            textAlign: "center", // Center the text
            flex: 1, // This will take all the remaining space
          }}
        >
          Edit
        </Text>

        {/* X Button (Top Right) */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            // height: 30,
            // width: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            // backgroundColor: "red",
          }}
        >
          <Ionicons name="close-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Color Picker */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly", // Color options closer together
          marginBottom: 16,
        }}
      >
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onChangeColor(c)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 16,
              backgroundColor: c,
              borderWidth: color === c ? 2 : 1,
              borderColor: "black",
            }}
          />
        ))}
      </View>

      {/* Thickness Slider */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 30,
          gap: 10,
        }}
      >
        <Text>Thickness: {thickness.toFixed(1)}</Text>
        <Slider
          minimumValue={0.5}
          maximumValue={10}
          step={0.1}
          value={thickness}
          onValueChange={(value: number) => onChangeThickness(value)}
          minimumTrackTintColor="#333"
          maximumTrackTintColor="#aaa"
          style={{ flex: 1 }}
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

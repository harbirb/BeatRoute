import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const COLORS = ["red", "blue", "green", "orange", "purple", "white", "black"];

const ColorPicker = ({
  setColor,
  currentColor,
}: {
  setColor: (color: string) => void;
  currentColor: string;
}) => {
  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.circle,
            { backgroundColor: color },
            currentColor === color && styles.selected,
          ]}
          onPress={() => setColor(color)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,

    borderColor: "gainsboro",
  },
  selected: {
    borderWidth: 3,
    borderColor: "black",
  },
});

export default ColorPicker;

import { useState } from "react";
import {
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

const ToggleButton = ({
  value,
  label,
  activeValue,
  inactiveValue,
  onChange,
}: any) => {
  const isActive = activeValue === value;

  return (
    <View>
      <TouchableOpacity
        onPress={() => onChange(isActive ? inactiveValue : activeValue)}
        style={{
          justifyContent: "center",
          borderColor: "black",
          borderWidth: isActive ? 2 : 1,
          borderRadius: 10,
          height: 30,
          paddingHorizontal: 5,
          outline: "solid",
          marginHorizontal: 4,
          backgroundColor: isActive ? "#fff" : "gainsboro",
        }}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  active: {
    backgroundColor: "green",
  },
  inactive: {
    backgroundColor: "red",
  },
});

export default ToggleButton;

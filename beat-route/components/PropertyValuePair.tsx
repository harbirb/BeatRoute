import { Colors, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";
import { StickerStyle } from "./Stickers";

export default function PropertyValuePair({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: StickerStyle;
}) {
  return (
    <View style={styles.pvpContainer}>
      <Text style={[styles.pvpLabel, { color: style?.color }]}>{label}</Text>
      <Text style={[styles.pvpValue, { color: style?.color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pvpContainer: {
    alignItems: "center",
    marginVertical: SPACING.small,
  },
  pvpLabel: {
    fontSize: FONT_SIZE.medium,
    color: Colors.light.icon,
  },
  pvpValue: {
    fontSize: FONT_SIZE.large,
    fontWeight: FONT_WEIGHT.bold,
  },
});

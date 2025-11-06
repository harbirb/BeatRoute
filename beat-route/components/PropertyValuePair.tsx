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
      <Text
        style={[
          styles.pvpLabel,
          {
            color: style?.color,
            // fontWeight: style?.fontWeight as any,
            // fontSize: (style?.fontSize as any) / 1.6,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.pvpValue,
          {
            color: style?.color,
            fontSize: style?.fontSize,
            fontWeight: style?.fontWeight as any,
          },
        ]}
      >
        {value}
      </Text>
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

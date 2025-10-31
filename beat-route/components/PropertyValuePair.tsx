import { Colors, FONT_SIZE, FONT_WEIGHT, SPACING } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";

export default function PropertyValuePair({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.pvpContainer}>
      <Text style={styles.pvpLabel}>{label}</Text>
      <Text style={styles.pvpValue}>{value}</Text>
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

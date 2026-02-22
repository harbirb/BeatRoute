import { View, StyleSheet, useColorScheme } from "react-native";
import { Colors, SPACING } from "@/constants/theme";

type Props = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: Props) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: theme.tint,
              opacity: i < current ? 1 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SPACING.small,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

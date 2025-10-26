import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, RADIUS, SPACING } from "@/constants/theme";

const Card = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    padding: SPACING.medium,
    backgroundColor: Colors.light.background,
    borderRadius: RADIUS.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;

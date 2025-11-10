import { useData } from "@/context/DataContext";
import { Stack } from "expo-router";

import { Alert, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import StyleEditor from "@/components/StyleEditor";
import { StickerStyle } from "@/components/Stickers";

const defaultStyle: StickerStyle = {
  color: "#ffffff",
  fontWeight: "normal",
  fontSize: 14,
  strokeWidth: 2,
};

export default function StudioScreen() {
  const { activities, loading } = useData();
  const polylines = activities.map((act) => act.polyline || "");

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <View
      style={{
        // flex: 1,
        // alignItems: "stretch",
        padding: 16,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      {/* TOOLBAR */}
      <StyleEditor style={defaultStyle} setStyle={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

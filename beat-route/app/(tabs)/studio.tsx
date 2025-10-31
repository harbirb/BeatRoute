import ActivitySticker from "@/components/ActivitySticker";
import { useData } from "@/context/DataContext";
import { Stack } from "expo-router";
import {
  Alert,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import ColorPicker, {
  Panel1,
  Panel2,
  Panel5,
  Preview,
  Swatches,
  OpacitySlider,
  HueSlider,
  PreviewText,
} from "reanimated-color-picker";

export default function StudioScreen() {
  const { activities, loading } = useData();

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          justifyContent: "flex-end",
          padding: 16,
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => Alert.alert("Font picker coming soon!")}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>FONT</Text>
        </Pressable>
        <Pressable onPress={() => Alert.alert("Color picker coming soon!")}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "lightgreen",
              borderColor: "black",
              borderWidth: 3,
            }}
          />
        </Pressable>
      </View>
      <ActivitySticker>
        <Text>HIIIId</Text>
      </ActivitySticker>
      <View>
        {/* <ColorPicker style={{ width: 300, gap: 20 }}>
          <Preview />
          <Panel5 />
          <OpacitySlider />
        </ColorPicker> */}
      </View>
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

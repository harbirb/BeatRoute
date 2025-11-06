import { Activity } from "@/context/DataContext";
import DistancePaceSticker from "./DistancePaceSticker";
import Polyline from "./Polyline";
import { View } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { FONT_SIZE, FONT_WEIGHT, SPACING, Colors } from "@/constants/theme";
import PropertyValuePair from "./PropertyValuePair";

export type StickerStyle = {
  color: string;
  fontWeight: string;
  fontSize: number;
  strokeWidth: number;
};

const defaultStyle: StickerStyle = {
  color: "#ffffff",
  fontWeight: "normal",
  fontSize: 14,
  strokeWidth: 2,
};

export default function Stickers(
  activity: Activity,
  inputStyle?: StickerStyle
): any[] {
  const style = inputStyle ?? defaultStyle;

  return [
    <View style={{ flexDirection: "row", gap: 30 }}>
      <PropertyValuePair
        label="Distance"
        value={(activity.distanceInMeters / 1000).toFixed(2)}
        style={style}
      />
      <PropertyValuePair label="Pace" value={"5:00 /km"} style={style} />
      <PropertyValuePair label="Avg HR" value={"143 bpm"} style={style} />
    </View>,
    // Polyline sticker
    <Polyline encodedPolyline={activity.polyline || ""} style={style} />,
    // Combined sticker
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Polyline encodedPolyline={activity.polyline || ""} style={style} />
      <View style={{ flexDirection: "row", gap: 30 }}>
        <PropertyValuePair
          label="Distance"
          value={(activity.distanceInMeters / 1000).toFixed(2)}
          style={style}
        />
        <PropertyValuePair label="Pace" value={"5:00 /km"} style={style} />
        <PropertyValuePair label="Time" value={"25:00"} style={style} />
      </View>
    </View>,
    <View style={{ flexDirection: "row", gap: 30 }}>
      <PropertyValuePair
        label="Distance"
        value={(activity.distanceInMeters / 1000).toFixed(2)}
        style={style}
      />
      <PropertyValuePair label="Pace" value={"5:00 /km"} style={style} />
      <PropertyValuePair label="Time" value={"25:00"} style={style} />
    </View>,
  ];
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

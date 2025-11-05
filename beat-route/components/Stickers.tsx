import { Activity } from "@/context/DataContext";
import DistancePaceSticker from "./DistancePaceSticker";
import Polyline from "./Polyline";
import { View } from "react-native";

export type StickerStyle = {
  color: string;
  fontWeight: string;
  fontSize: number;
  thickness: number;
};

const defaultStyle: StickerStyle = {
  color: "#ffffff",
  fontWeight: "normal",
  fontSize: 14,
  thickness: 2,
};

export default function Stickers(
  activity: Activity,
  style?: StickerStyle
): any[] {
  style = style || defaultStyle;
  return [
    <DistancePaceSticker
      distance={(activity.distanceInMeters / 1000).toFixed(2)}
      pace={"5:00 /km"}
      color={style.color}
    ></DistancePaceSticker>,
    <Polyline encodedPolyline={activity.polyline || ""} color={style.color} />,
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Polyline encodedPolyline={activity.polyline || ""} color={style.color} />
      <DistancePaceSticker
        distance={(activity.distanceInMeters / 1000).toFixed(2)}
        pace={"5:00 /km"}
        color={style.color}
      ></DistancePaceSticker>
    </View>,
  ];
}

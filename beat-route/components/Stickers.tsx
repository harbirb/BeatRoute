import { Activity } from "@/context/DataContext";
import DistancePaceSticker from "./DistancePaceSticker";
import Polyline from "./Polyline";
import { Text } from "react-native";

export default function Stickers(activity: Activity, color: string): any[] {
  console.log(color);
  return [
    <DistancePaceSticker
      distance={(activity.distanceInMeters / 1000).toFixed(2)}
      pace={"5:00 /km"}
      color={color}
    ></DistancePaceSticker>,
    <Text>More stickers</Text>,
    <Polyline encodedPolyline={activity.polyline || ""} color={color} />,
  ];
}

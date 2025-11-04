import { View } from "react-native";
import PropertyValuePair from "./PropertyValuePair";

export default function dps({
  distance,
  pace,
  color,
}: {
  distance: string;
  pace: string;
  color: string;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10, backgroundColor: color }}>
      <PropertyValuePair label="Distance" value={distance} />
      <PropertyValuePair label="Pace" value={pace} />
    </View>
  );
}

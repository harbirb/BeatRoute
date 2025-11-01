import { View } from "react-native";
import PropertyValuePair from "./PropertyValuePair";

export default function dps({
  distance,
  pace,
}: {
  distance: string;
  pace: string;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <PropertyValuePair label="Distance" value={distance} />
      <PropertyValuePair label="Pace" value={pace} />
    </View>
  );
}

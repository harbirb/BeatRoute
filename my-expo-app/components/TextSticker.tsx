import { View, Text } from "react-native";
import Svg from "react-native-svg";

type Props = {
  // data as an encoded polyline string
  data: string;
  color: string;
  scale?: number;
};

export const TextSticker: React.FC<Props> = ({ data, color, scale }) => {
  return (
    <View style={{ alignItems: "flex-start" }}>
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={{
          color,
          fontSize: 80,
          fontStyle: "italic",
          fontWeight: "bold",
        }}
      >
        {data}
      </Text>
    </View>
  );
};

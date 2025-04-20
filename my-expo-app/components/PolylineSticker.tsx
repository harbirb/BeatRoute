import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  // points as a string of the form "x1,y1 x2,y2 x3,y3 ..."
  points: string;
  color: string;
  scale?: number;
};

export const PolylineSticker: React.FC<Props> = ({ points, color, scale }) => {
  return (
    <View
      style={{
        width: 500 * (scale ?? 1),
        height: 500 * (scale ?? 1),
        // backgroundColor: "white",
      }}
    >
      <Svg width="100%" height="100%" viewBox="-5 -5 200 200">
        <Polyline points={points} stroke={color} fill="none" strokeWidth={2} />
      </Svg>
    </View>
  );
};

import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  // points as a string of the form "x1,y1 x2,y2 x3,y3 ..."
  points: string;
  color: string;
};

export const PolylineSticker: React.FC<Props> = ({ points, color }) => {
  return (
    <View style={{ width: 500, height: 500 }}>
      <Svg width="100%" height="100%" viewBox="0 -5 100 100">
        <Polyline points={points} stroke={color} fill="none" strokeWidth={3} />
      </Svg>
    </View>
  );
};

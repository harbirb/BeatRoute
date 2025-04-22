import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  // data as an encoded polyline string
  data: string;
  color: string;
  scale?: number;
};

const DEFAULT_SIZE = 400;

export const PolylineSticker: React.FC<Props> = ({ data, color, scale }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [points, setPoints] = useState("");

  useEffect(() => {
    setPoints(processPolyline(data));
  }, []);

  function processPolyline(encodedPolyline: string) {
    const coords = polyline.decode(encodedPolyline);
    const minLat = Math.min(...coords.map((c) => c[0]));
    const maxLat = Math.max(...coords.map((c) => c[0]));
    const minLng = Math.min(...coords.map((c) => c[1]));
    const maxLng = Math.max(...coords.map((c) => c[1]));

    const mapWidth = maxLng - minLng;
    const mapHeight = maxLat - minLat;
    const maxSize = Math.max(mapWidth, mapHeight);
    setWidth((mapWidth / maxSize) * DEFAULT_SIZE);
    setHeight((mapHeight / maxSize) * DEFAULT_SIZE);

    // TODO: scale to fit square properly
    const normCoords = coords.map(([lat, lng]) => ({
      x: ((lng - minLng) / maxSize) * DEFAULT_SIZE,
      y: ((maxLat - lat) / maxSize) * DEFAULT_SIZE,
    }));
    return normCoords.map((p) => `${p.x},${p.y}`).join(" ");
  }

  return (
    <View
      style={{
        width: width * (scale ?? 1),
        height: height * (scale ?? 1),
        // backgroundColor: "gainsboro",
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`-5 -5  ${width + 10} ${height + 10}`}
      >
        <Polyline points={points} stroke={color} fill="none" strokeWidth={4} />
      </Svg>
    </View>
  );
};

import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  // data as an encoded polyline string
  stickerData: any;
  scale?: number;
};

const DEFAULT_SIZE = 400;

export const PolylineSticker: React.FC<Props> = ({ stickerData, scale }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [points, setPoints] = useState("");

  useEffect(() => {
    setPoints(processPolyline(stickerData.data));
  }, []);

  function processPolyline(encodedPolyline: string) {
    const originalCoords = polyline.decode(encodedPolyline);
    const avgLat =
      originalCoords.reduce((sum, [lat, _lng]) => sum + lat, 0) /
      originalCoords.length;

    const correctionFactor = Math.cos((avgLat * Math.PI) / 180);
    const coords = originalCoords.map(([lat, lng]) => [
      lat,
      lng * correctionFactor,
    ]);

    const minLat = Math.min(...coords.map((c) => c[0]));
    const maxLat = Math.max(...coords.map((c) => c[0]));
    const minLng = Math.min(...coords.map((c) => c[1]));
    const maxLng = Math.max(...coords.map((c) => c[1]));

    const mapWidth = maxLng - minLng;
    const mapHeight = maxLat - minLat;
    const maxSize = Math.max(mapWidth, mapHeight);
    setWidth((mapWidth / maxSize) * DEFAULT_SIZE);
    setHeight((mapHeight / maxSize) * DEFAULT_SIZE);

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
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`-5 -5  ${width + 10} ${height + 10}`}
      >
        <Polyline
          points={points}
          stroke={stickerData.color}
          strokeLinecap="round"
          strokeLinejoin="bevel"
          fill="none"
          strokeWidth={stickerData.thickness}
        />
      </Svg>
    </View>
  );
};

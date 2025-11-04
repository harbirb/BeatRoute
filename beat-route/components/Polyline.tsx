import { View, Text } from "react-native";
import polyline from "@mapbox/polyline";
import MapView, { Polyline as MapPolyline } from "react-native-maps";
import Svg, { Polyline as SvgPolyline } from "react-native-svg";

const PADDING = 5;

export default function Polyline({
  encodedPolyline,
  color,
}: {
  encodedPolyline: string;
  color: string;
}) {
  // decode polyline to lat/lng points
  const decodedPoints = polyline.decode(encodedPolyline);

  // cosine correction for latitude distortion
  const avgLat =
    decodedPoints.reduce((sum, [lat, _lng]) => sum + lat, 0) /
    decodedPoints.length;
  const correctionFactor = Math.cos((avgLat * Math.PI) / 180);
  const coords = decodedPoints.map(([lat, lng]) => [
    lat,
    lng * correctionFactor,
  ]);

  // find min/max lat/lng
  const minLat = Math.min(...coords.map((p) => p[0]));
  const maxLat = Math.max(...coords.map((p) => p[0]));
  const minLng = Math.min(...coords.map((p) => p[1]));
  const maxLng = Math.max(...coords.map((p) => p[1]));

  // find longest side
  const dy = maxLng - minLng;
  const dx = maxLat - minLat;
  const longestSide = Math.max(dy, dx);

  // calculate scaling based on longest side
  // TODO: make size dynamic based on screen size or parent size container
  const baseSize = 300;
  const scale = baseSize / longestSide;

  // calculate dimensions with padding (avoid clipping)
  const width = dy * scale + 2 * PADDING;
  const height = dx * scale + 2 * PADDING;

  // scale and translate points to x/y coordinates
  const points = coords
    .map(([lat, lng]) => {
      const x = (lng - minLng) * scale + PADDING;
      const y = (maxLat - lat) * scale + PADDING;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Svg style={{ width, height }}>
      <SvgPolyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
    </Svg>
  );
}

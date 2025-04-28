import polyline from "@mapbox/polyline";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import Svg, { Polyline as SvgPolyline } from "react-native-svg";

type Props = {
  stickerData: any;
  scale?: number;
};

const DEFAULT_SIZE = 400;

const getBounds = (coords: { latitude: number; longitude: number }[]) => {
  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLng = coords[0].longitude;
  let maxLng = coords[0].longitude;

  coords.forEach((coord) => {
    if (coord.latitude < minLat) minLat = coord.latitude;
    if (coord.latitude > maxLat) maxLat = coord.latitude;
    if (coord.longitude < minLng) minLng = coord.longitude;
    if (coord.longitude > maxLng) maxLng = coord.longitude;
  });

  return { minLat, maxLat, minLng, maxLng };
};

const getCoords = (encodedPolyline: string) => {
  const coords = polyline.decode(encodedPolyline);
  return coords.map(([lat, lng]) => {
    return {
      latitude: lat,
      longitude: lng,
    };
  });
};

export const MapSticker: React.FC<Props> = ({ stickerData, scale }) => {
  const coords = getCoords(stickerData.data);
  const bounds = getBounds(coords);
  const correctionFactor = Math.cos((coords[0].latitude * Math.PI) / 180);
  const apectRatio =
    Math.abs(bounds.minLat - bounds.maxLat) /
    (Math.abs(bounds.minLng - bounds.maxLng) * correctionFactor);
  return (
    <View
      style={{
        flex: 1,
        opacity: 0.7,
      }}
    >
      <MapView
        mapType="mutedStandard"
        pointerEvents="none"
        userInterfaceStyle="light"
        region={{
          latitude: (bounds.minLat + bounds.maxLat) / 2,
          longitude: (bounds.minLng + bounds.maxLng) / 2,
          latitudeDelta: Math.abs(bounds.minLat - bounds.maxLat) * 1.2,
          longitudeDelta: Math.abs(bounds.minLng - bounds.maxLng) * 1.2,
        }}
        style={{
          width: DEFAULT_SIZE * (scale ?? 1),
          height: DEFAULT_SIZE * apectRatio * (scale ?? 1),
          borderRadius: 18,
        }}
      >
        <Polyline
          coordinates={coords}
          strokeWidth={stickerData.thickness}
          strokeColor={stickerData.color}
        />
      </MapView>
      {/* this view makes it easy to tap on the sticker */}
      {/* <View
        style={{
          ...StyleSheet.absoluteFillObject,
          // backgroundColor: "white",
          borderRadius: 18,
          opacity: 0.3,
        }}
      /> */}
    </View>
  );
};

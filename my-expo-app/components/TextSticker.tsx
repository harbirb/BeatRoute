import { View, Text } from "react-native";

type Props = {
  // data as an encoded polyline string
  stickerData: any;
  scale?: number;
};

export const TextSticker: React.FC<Props> = ({ stickerData, scale }) => {
  const mapThicknessToWeight = (thickness: number): string => {
    const weightScale = [
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ];
    const scaledIndex = Math.round(
      ((thickness - 0.5) / 9.5) * (weightScale.length - 1)
    );
    return weightScale[scaledIndex];
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        // @ts-ignore
        style={{
          color: stickerData.color,
          fontSize: 100,
          fontStyle: "italic",
          fontFamily: stickerData.font,
          fontWeight: mapThicknessToWeight(stickerData.thickness),
        }}
      >
        {stickerData.data}
      </Text>
    </View>
  );
};

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

  const baseSize = 100;
  const smallTextRatio = 0.3;

  return (
    <View
      style={{
        alignItems: "center",
        transform: [{ scale: scale ?? 1 }],
      }}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        // @ts-ignore
        style={{
          fontSize: baseSize * smallTextRatio * (scale ?? 1),
          color: stickerData.color,
          fontWeight: mapThicknessToWeight(stickerData.thickness),
          fontFamily: stickerData.font,
          fontStyle: "italic",
          marginBottom: 5,
        }}
      >
        {stickerData.caption}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        // @ts-ignore
        style={{
          color: stickerData.color,
          fontSize: baseSize * (scale ?? 1),
          fontStyle: "italic",
          fontFamily: stickerData.font,
          fontWeight: mapThicknessToWeight(stickerData.thickness),
        }}
      >
        {" " + stickerData.data + " "}
      </Text>
    </View>
  );
};

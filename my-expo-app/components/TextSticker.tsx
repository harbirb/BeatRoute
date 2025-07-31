import { View, Text } from "react-native";

type Props = {
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

  const baseSize = 60;
  const smallTextRatio = 0.35;

  return (
    <View
      style={{
        alignItems: "center",
        // backgroundColor: "white",
      }}
    >
      <Text
        numberOfLines={1}
        // adjustsFontSizeToFit={true}
        // @ts-ignore
        style={{
          fontSize: baseSize * smallTextRatio * (scale ?? 1),
          color: stickerData.color,
          fontWeight: stickerData.weight,
          fontStyle: stickerData.style,
        }}
      >
        {stickerData.caption}
      </Text>
      <Text
        numberOfLines={1}
        // adjustsFontSizeToFit={true}
        // @ts-ignore
        style={{
          color: stickerData.color,
          fontSize: baseSize * (scale ?? 1),
          fontStyle: stickerData.style,
          fontFamily: stickerData.font,
          fontWeight: stickerData.weight,
        }}
      >
        {" " + stickerData.data + " "}
      </Text>
    </View>
  );
};

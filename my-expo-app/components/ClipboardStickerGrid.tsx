import { View, Text, FlatList, ImageBackground } from "react-native";
import ClipboardSticker from "./ClipboardSticker";
import { TextSticker } from "./TextSticker";
import { PolylineSticker } from "./PolylineSticker";

type Props = {
  stickerData: any;
  styling: any;
};

export default function ClipboardStickerGrid({ stickerData, styling }: Props) {
  const polyline = stickerData.stickers.find(
    (sticker: any) => sticker.type === "polyline"
  );
  const texts = stickerData.stickers.filter(
    (sticker: any) => sticker.type === "text"
  );
  return (
    <View style={{ margin: 10, alignItems: "center" }}>
      <Text style={{ color: "gray", fontSize: 20, fontWeight: "bold" }}>
        {stickerData.name}
      </Text>
      {polyline && drawPolyline(polyline, styling)}
      <FlatList
        data={texts}
        renderItem={({ item }) => drawText(item, styling)}
        style={{
          marginTop: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        columnWrapperStyle={{
          gap: 12,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        // scrollEnabled={false}
        numColumns={2}
      />
    </View>
  );
}

function drawText(item: any, styling: any) {
  return (
    <ImageBackground
      style={{
        width: 180,
        height: 100,
        overflow: "hidden",
        borderRadius: 30,
        borderColor: "#fc4c02",
        borderWidth: 2,
      }}
      source={require("../assets/images/tinycbdark.png")}
      resizeMode="repeat"
    >
      <ClipboardSticker>
        <TextSticker
          stickerData={{
            caption: item.caption,
            data: item.data,
            font: styling.textFont,
            style: styling.textStyle,
            color: styling.textColor,
            weight: styling.textWeight,
          }}
          scale={0.6}
        />
      </ClipboardSticker>
    </ImageBackground>
  );
}

function drawPolyline(item: any, styling: any) {
  return (
    <ImageBackground
      style={{
        width: 300,
        height: 300,
        overflow: "hidden",
        borderRadius: 30,
        borderColor: "black",
        borderWidth: 1,
      }}
      source={require("../assets/images/tinycbdark.png")}
      resizeMode="repeat"
    >
      <ClipboardSticker>
        <PolylineSticker
          stickerData={{
            data: item.data,
            color: styling.lineColor,
            thickness: styling.lineWidth,
          }}
          scale={0.72}
        />
      </ClipboardSticker>
    </ImageBackground>
  );
}

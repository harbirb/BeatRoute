import {
  Pressable,
  View,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

const FontButton = ({
  font,
  displayName,
  isSelected,
  onPress,
}: {
  font: string;
  displayName: string;
  isSelected: boolean;
  onPress: (_: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(font)}
      style={{
        justifyContent: "center",
        borderColor: "black",
        borderWidth: isSelected ? 2 : 1,
        borderRadius: 10,
        height: 30,
        paddingHorizontal: 5,
        outline: "solid",
        marginHorizontal: 4,
        backgroundColor: isSelected ? "#fff" : "gainsboro",
      }}
    >
      <Text style={{ fontFamily: font }}>{displayName}</Text>
    </TouchableOpacity>
  );
};

const FontPicker = ({
  setFont,
  currentFont,
}: {
  setFont: (font: string) => void;
  currentFont: string;
}) => {
  const fontOptions = [
    { font: "Times New Roman", displayName: "Times" },
    { font: "Arial", displayName: "Arial" },
    { font: "Comic Sans MS", displayName: "Comic" },
    { font: "Courier", displayName: "Courier" },
    { font: "Helvetica", displayName: "Helvetica" },
    { font: "Verdana", displayName: "Verdana" },
    { font: "Georgia", displayName: "Georgia" },
    { font: "Permanent Marker", displayName: "Marker" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {fontOptions.map(({ font, displayName }) => (
        <FontButton
          key={font}
          font={font}
          displayName={displayName}
          isSelected={currentFont === font}
          onPress={setFont}
        />
      ))}
    </ScrollView>
  );
};

export default FontPicker;

import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  TouchableOpacity,
  Text,
} from "react-native";

import { useRouter } from "expo-router";

const PlaceholderImage = require("@/assets/images/IMG_1014.jpg");

export default function Index() {
  const router = useRouter();

  const launchPhotoEditor = () => {
    router.push({
      pathname: "/photo-editor",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => launchPhotoEditor()}
        style={{ backgroundColor: "#2196F3", padding: 12, borderRadius: 18 }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Launch Editor
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

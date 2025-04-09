import { usePreventRemove } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

const richmond = require("../assets/images/IMG_1014.jpg");

export default function PhotoEditor() {
  const router = useRouter();
  const [showStickerModal, setShowStickerModal] = useState(false);

  // usePreventRemove(true, () => {
  //   alert("Are you sure you want to leave?");
  // });

  return (
    <View style={styles.container}>
      <Image source={richmond} style={styles.image} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </Pressable>
      <Pressable
        style={styles.stickerButton}
        onPress={() => setShowStickerModal(true)}
      >
        <MaterialCommunityIcons name="sticker-emoji" size={24} color="black" />
      </Pressable>
      <Modal
        visible={showStickerModal}
        onRequestClose={() => setShowStickerModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowStickerModal(false)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "pink",
    position: "relative",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 20,
  },
  backButton: {
    position: "absolute",
    backgroundColor: "white",
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 99,
  },
  stickerButton: {
    position: "absolute",
    backgroundColor: "white",
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 99,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  modalView: {
    margin: 20,
    backgroundColor: "gainsboro",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

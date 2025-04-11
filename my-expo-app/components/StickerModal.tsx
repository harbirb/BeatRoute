import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const StickerModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
    >
      <View style={styles.modalView}>
        <View
          style={{
            width: 40,
            height: 5,
            backgroundColor: "#ccc",
            borderRadius: 99,
            marginBottom: 20,
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});

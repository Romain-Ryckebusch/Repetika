import { Modal, Pressable, StyleSheet, View } from 'react-native';
import colors from '../styles/colors';

export default function CustomModal({ visible, onClose, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <View style={styles.innerView}>
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    color: colors.white,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    padding: 20,
    alignSelf: 'center',
    width: '99%',
    maxHeight: '50%',
  },
  innerView: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
  },
});

// TrophyItem.js
import { View, Text, Image, StyleSheet, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import Crd_trophy from './crd_trophy';

export default function TrophyItem({ label, unlocked, corpus, date }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (unlocked) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Pressable style={styles.container} onPress={handlePress}>
        <Text style={styles.label}>{label}</Text>
        <Image
          source={
            unlocked
              ? require('../assets/trophy_gold.png')
              : require('../assets/trophy_silver.png')
          }
          style={styles.trophy}
        />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable onPress={() => {}} style={styles.modalContent}>
            <Crd_trophy title={label} corpus={corpus} date={date} />
          </Pressable>
        </Pressable>
        
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '24%',
  },
  trophy: {
    width: 60,
    height: 70,
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'KronaOne_Regular', 
    bottom: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    },
});

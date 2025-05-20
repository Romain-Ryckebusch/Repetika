import React, {useState} from 'react';
import { ScrollView, View, StyleSheet, Text, Modal, Button } from 'react-native';
import { useGlobalFonts } from './src/styles/globalFonts';
import colors from './src/styles/colors';
import globalStyles from './src/styles/global';

import Btn_fill from './src/components/btn_fill';
import Btn_empty from './src/components/btn_empty';
import Input from './src/components/frm_input';

import Crd_trophy from './src/components/crd_trophy';
import Crd_lesson from './src/components/crd_lesson';
import Crd_confirm from './src/components/crd_confirm';


export default function App() {
  
  const [showConfirm, setShowConfirm] = useState(false);
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;


  return (
    <ScrollView>

      <View style={styles.container}>

        <Btn_empty title="S'inscrire" onPress={() => console.log('cliqué')}/>


        <Text style={globalStyles.chapter}>crd_trophy</Text>
        <Crd_trophy 
          title="Tryharder" 
          corpus="    Vous êtes venu tous les jours pendant plus d’un an. Emilien n’a qu’à bien se tenir." 
          date="19/05/2025"
        />


        <Text style={globalStyles.chapter}>crd_lesson</Text>
        <Crd_lesson 
          title="Physique du solide" 
          corpus="    Apprenez les bases de la physique à l'échelle atomique." 
          progress="99"
          crd_number="10"
          onPress={() => console.log("Clic sur la leçon !")}
        />

        <Text style={globalStyles.chapter}>crd_confirm</Text>
        <Button title="Ouvrir la fenêtre" onPress={() => setShowConfirm(true)} />

        <Modal
          visible={showConfirm}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowConfirm(false)}
        >
          <View style={globalStyles.modalOverlay}>
            <Crd_confirm 
              title="Quitter sans sauvegarder ?" 
              corpus="    Les modifications apportées seront perdues." 
              btn1_text="Retour"
              btn1_function={() => setShowConfirm(false)}
              btn1_style={globalStyles.btn_confimrbox_neutral}

              btn2_text="Quitter"
              btn2_function={() => console.log("Quitter")}
              btn2_style={globalStyles.btn_confimrbox_alert}
            />
          </View>
        </Modal>

      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap:30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
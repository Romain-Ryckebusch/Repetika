import { View, StyleSheet, Text, TouchableOpacity, ScrollView} from "react-native";
import { useGlobalFonts } from '../styles/globalFonts';
import globalStyles from '../styles/global';
import colors from '../styles/colors';

import Crd_lesson from '../components/crd_lesson';

export default function HomeScreen() {

    return (
        <View style={{ flex: 1 }}>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
                <Text style={[globalStyles.title, styles.title]}>Qu'est-ce qu'on apprend aujourd'hui, Louis ?</Text>
            
                <View style={styles.Crd_container}>

                    {[...Array(4)].map((_, index) => (
                        <Crd_lesson 
                            key={index}
                            title={`Cours ${index}`}
                            corpus="    Apprenez les bases de la physique à l'échelle atomique." 
                            progress="99"
                            crd_number="10"
                            onPress={() => console.log("Clic sur la leçon !")}
                        />
                    ))}

                    <TouchableOpacity style={styles.addCard} onPress={() => console.log("Clic sur le bouton !")}>
                        <Text style={{fontSize: 32, color:colors.grey}}>+</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 40,
  },
  Crd_container: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    fontSize: 21,
    padding: 10,
    paddingTop: 30,
  },
  addCard: {
    width: '93%',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dotted',
    borderWidth: 3,
    borderColor: colors.grey,
    height: 180,
    },
});
import { View, StyleSheet, Text, TouchableOpacity, ScrollView} from "react-native";
import { useGlobalFonts } from '../styles/globalFonts';
import globalStyles from '../styles/global';
import colors from '../styles/colors';

import Crd_lesson from '../components/crd_lesson';

const lessons = [
  { id:'1', title: 'Cours 1', corpus: 'Apprenez les bases de la physique à l\'échelle atomique.', progress: '9', crd_number: '10', onPress: () => console.log("Clic sur la leçon !") },
  { id:'2', title: 'Cours 2', corpus: 'Apprenez les bases de la chimie à l\'échelle atomique.', progress: '20', crd_number: '5', onPress: () => console.log("Clic sur la leçon !") },
  { id:'3', title: 'Cours 3', corpus: 'Apprenez les bases de la biologie à l\'échelle atomique.', progress: '25', crd_number: '2', onPress: () => console.log("Clic sur la leçon !") },
];

export default function HomeScreen() {

    return (
        <View style={{ flex: 1 }}>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                <Text style={[globalStyles.title, styles.title]}>Qu'est-ce qu'on apprend aujourd'hui, Louis ?</Text>
            
                <View style={styles.Crd_container}>

                    {lessons.map((lesson) => (
                        <Crd_lesson 
                            key={lesson.id}
                            title={lesson.title}
                            corpus={lesson.corpus}
                            progress={lesson.progress}
                            crd_number={lesson.crd_number}
                            onPress={lesson.onPress}
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
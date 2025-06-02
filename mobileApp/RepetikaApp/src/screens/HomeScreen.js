import { View, Text, TouchableOpacity, ScrollView} from "react-native";
import { useGlobalFonts } from '../styles/globalFonts';

import globalStyles from '../styles/global';
import colors from '../styles/colors';
import styles from '../styles/HomeScreen.style';

import Crd_lesson from '../components/crd_lesson';
import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {navigate} from "../navigation/NavigationService";
import api from "../config/apiService";
import {useEffect, useState} from "react";
import ErrorView from "../components/error";

const lessons = [
  { id:'1', title: 'Cours 1', corpus: 'Apprenez les bases de la physique à l\'échelle atomique.', progress: '9', crd_number: '10', onPress: () => console.log("Clic sur la leçon !") },
  { id:'2', title: 'Cours 2', corpus: 'Apprenez les bases de la chimie à l\'échelle atomique.', progress: '20', crd_number: '5', onPress: () => console.log("Clic sur la leçon !") },
  { id:'3', title: 'Cours 2', corpus: "Apprenez les bases de l'informatique à l\'échelle atomique.", progress: '20', crd_number: '5', onPress: () => console.log("Clic sur la leçon !") },
];

export const getCoursOfUser = () => api.get('/cours/getChapter?user_id=68386a41ac5083de66afd675');

export default function HomeScreen() {
    const {t}=useTranslation();

    const [showNetworkError, setShowNetworkError] = useState(false);

    useEffect(() => {
        const loadCours = async () => {
            try {
                const response = await getCoursOfUser();
                console.log(response.data); // Affiche les données des cours
            } catch (error) {
                setShowNetworkError(true)
            }
        };

        loadCours(); // Appel au montage
    }, []);


    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                    <Text style={[globalStyles.title, styles.title]}>{t("homeScreen.splashMessage",{prenom:"Louis"})}</Text>
                    <ErrorView visibility={showNetworkError} text={"Nous n'avons pas pu vous connecter à la base de donnéees. Vérifiez votre connexion internet."}/>


                    <View style={styles.Crd_container}>

                        {lessons.map((lesson) => (
                            <Crd_lesson
                                key={lesson.id}
                                title={lesson.title}
                                corpus={lesson.corpus}
                                progress={lesson.progress}
                                crd_number={lesson.crd_number}
                                onPress={()=>navigate("gameScreens",{
                                    screen:"CourseIndex",
                                    params: {
                                        lessonId: lesson.id,
                                    }
                                })}
                            />
                        ))}

                        <TouchableOpacity style={styles.addCard} onPress={() => console.log("Clic sur le bouton !")}>
                            <Text style={{fontSize: 32, color:colors.grey}}>+</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}


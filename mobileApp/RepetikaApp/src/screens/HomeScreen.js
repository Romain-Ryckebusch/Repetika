import React, {useContext, useEffect, useState, useCallback} from "react";
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import globalStyles from '../styles/global';
import colors from '../styles/colors';
import styles from '../styles/HomeScreen.style';

import Crd_lesson from '../components/crd_lesson';
import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {navigate} from "../navigation/NavigationService";
import ErrorView from "../components/error";
import useFetch from "../utils/useFetch";
import {AuthContext} from "../utils/AuthContext";
import {checkAchievements} from "../utils/achievements/checkAchievements";
import config from "../config/config";
import {CourseContext} from "../utils/CourseContext";



export default function HomeScreen() {



    const {t}=useTranslation();
    const [lessons, setLessons] = useState([]);
    const [showNetworkError, setShowNetworkError] = useState(false);
    const {userId}=useContext(AuthContext);
    const url = config.BASE_URL+`/main/getAccessibleCourses?user_id=${userId}`;
    const { data, loading, error, refetch } = useFetch(url);

    // Rafraîchir la liste des cours à chaque focus
    useFocusEffect(
        useCallback(() => {
            if (typeof refetch === 'function') {
                refetch();
            }
        }, [refetch])
    );

    useEffect(() => {
        if (data) {
            setLessons(data);
            setShowNetworkError(false)
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setShowNetworkError(true);
        }
    }, [error]);

    const {userStats,setUserStats} = useContext(AuthContext);
    const {setCurrentDeckId,setCurrentCoursId,setCurrentCoursName} = useContext(CourseContext);

    useEffect(() => {
        checkAchievements(userStats, (achievement) => {

            // Ajoute aux succès débloqués
            const updatedStats = {
                ...userStats,
                unlockedAchievements: [...userStats.unlockedAchievements, achievement.id],
            };
            setUserStats(updatedStats);


            // Feedback UI
            console.log("Achievement débloqué"+achievement.titleFr)
        });
    }, [userStats]); // ou après une action spécifique


    const navigateToCours = (idCours,idDeck,name)=>{

        setCurrentDeckId(idDeck);
        setCurrentCoursId(idCours);
        setCurrentCoursName(name)
        navigate("gameScreens",{

            screen:"CourseIndex",
        })
    }







    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                    <Text style={[globalStyles.title, styles.title]}>{t("homeScreen.splashMessage",{prenom:""})}</Text>

                    <ErrorView visibility={showNetworkError} text={"Nous n'avons pas pu vous connecter à la base de donnéees. Vérifiez votre connexion internet."}/>

                    <View style={styles.Crd_container}>

                        {
                            loading?(
                            <ActivityIndicator size="large" color={colors.primary} />
                            ):(null)
                        }

                        {lessons.map((lesson) => (

                            <Crd_lesson
                                key={lesson.id_cours}
                                title={lesson.nom_cours}
                                corpus={"description"}
                                progress={lesson.progress}
                                crd_number={lesson.cards_today}
                                onPress={()=>navigateToCours(lesson.id_cours,lesson.id_deck,lesson.nom_cours)}
                            />
                        ))}

                        <TouchableOpacity style={styles.addCard} onPress={() => navigate("ChooseCourses")}>
                            <Text style={{fontSize: 32, color:colors.grey}}>+</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

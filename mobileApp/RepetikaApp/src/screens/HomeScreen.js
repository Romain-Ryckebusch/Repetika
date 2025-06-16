import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from "react-native";

import globalStyles from '../styles/global';
import colors from '../styles/colors';
import styles from '../styles/HomeScreen.style';

import Crd_lesson from '../components/crd_lesson';
import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {navigate} from "../navigation/NavigationService";
import api from "../config/apiService";
import {useContext, useEffect, useState} from "react";
import ErrorView from "../components/error";
import useFetch from "../utils/useFetch";
import {AuthContext} from "../utils/AuthContext";
import {checkAchievements} from "../utils/achievements/checkAchievements";
import config from "../config/config";
import {CourseContext} from "../utils/CourseContext";


//export const getCoursOfUser = () => api.get('/main/getAccessibleCourses?user_id=68386a41ac5083de66afd675');


export default function HomeScreen() {



    const {t}=useTranslation();


    const [lessons, setLessons] = useState([]);
    const [showNetworkError, setShowNetworkError] = useState(false);
/*
    useEffect(() => {
        const loadCours = async () => {
            try {
                console.log("effect")
                const response = await getCoursOfUser();
                console.log(response); // Affiche les données des cours
                setLessons(response.data);
            } catch (error) {
                setShowNetworkError(true)
            }
        };

        loadCours(); // Appel au montage
    }, []);
*/

    const {userId}=useContext(AuthContext);

    const url = config.BASE_URL+`/main/getAccessibleCourses?user_id=${userId}`;
    console.log(url);
    const { data, loading, error } = useFetch(url);

    useEffect(() => {
        if (data) {
            setLessons(data);
            setShowNetworkError(false)
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            console.log(error);
            setShowNetworkError(true);
        }
    }, [error]);

    const {userStats,setUserStats} = useContext(AuthContext);
    const {setCurrentDeckId,setCurrentCoursId} = useContext(CourseContext);

    useEffect(() => {
        console.log("start of check")
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


    const navigateToCours = (idCours,idDeck)=>{

        setCurrentDeckId(idDeck);
        setCurrentCoursId(idCours);
        navigate("gameScreens",{

            screen:"CourseIndex",
        })
    }


    console.log(lessons);




    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                    <Text style={[globalStyles.title, styles.title]}>{t("homeScreen.splashMessage",{prenom:"Louis"})}</Text>

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
                                onPress={()=>navigateToCours(lesson.id_cours,lesson.id_deck)}
                            />
                        ))}

                        <TouchableOpacity style={styles.addCard} onPress={() => navigate("createCourseScreens")}>
                            <Text style={{fontSize: 32, color:colors.grey}}>+</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}


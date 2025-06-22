/**
 * @file course.js
 * @description Composant React Native pour afficher les chapitres d'un cours sous forme de boutons interactifs.
 * @module Course
 */

import {View, Text, Dimensions, Image, ActivityIndicator} from "react-native";
import styles from '../../../styles/game/courseIndex.style';
import colors from '../../../styles/colors';
import {navigate} from "../../../navigation/NavigationService";
import {PlatformPressable} from "@react-navigation/elements";
import {useContext, useEffect, useState, useMemo} from "react";
import {AuthContext} from "../../../utils/AuthContext";
import useFetch from "../../../utils/useFetch";
import Config from "../../../config/config";

/**
 * @function ChapterButton
 * @description Composant pour afficher un bouton représentant un chapitre.
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.chapter - Les données du chapitre.
 * @param {Function} props.onPress - Fonction appelée lors du clic sur le bouton.
 * @param {Object} props.style - Styles personnalisés pour le bouton.
 * @param {number} props.widthCircle - Largeur et hauteur du cercle représentant le chapitre.
 * @param {Object} props.colors - Palette de couleurs utilisée pour le style.
 * @returns {JSX.Element} Bouton interactif pour un chapitre.
 */
function ChapterButton({chapter, onPress, style, widthCircle, colors}) {
    const backgroundColor = useMemo(() =>
            chapter.is_unlocked && !chapter.is_finished
                ? colors.currentChapter
                : !chapter.is_unlocked
                    ? colors.lockedChapter
                    : colors.primary
        , [chapter, colors]);

    return (
        <PlatformPressable
            onPress={() => onPress(chapter.id_chapitre)}
            key={chapter.id_chapitre}
            style={style}
            disabled={!chapter.is_unlocked}
        >
            <View style={[
                styles.coursePage.chapterView,
                {width: widthCircle, height: widthCircle, borderRadius: 0.5 * widthCircle, backgroundColor}
            ]}>
                {!chapter.is_unlocked &&
                    <Image style={styles.coursePage.chapterView.icon} source={require("../../../assets/icons/lock.png")}/>
                }
            </View>
            <Text style={styles.coursePage.chapterView.title}>{chapter.nom_chapitre}</Text>
        </PlatformPressable>
    );
}

/**
 * @function Course
 * @description Composant principal pour afficher les chapitres d'un cours avec une disposition en colonnes.
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.courseId - Identifiant du cours.
 * @param {number} props.deckId - Identifiant du deck associé.
 * @returns {JSX.Element} Vue principale du cours avec les chapitres.
 */
export default function Course({courseId, deckId}) {
    const {userId} = useContext(AuthContext); // Récupère l'identifiant utilisateur depuis le contexte d'authentification.
    const url = Config.BASE_URL + `/main/getCourseChapters?user_id=${userId}&id_course=${courseId}`; // URL de l'API pour récupérer les chapitres du cours.
    const [course, setCourse] = useState([]); // État pour stocker les données des chapitres du cours.
    const [lineList, setLineList] = useState([]); // État pour stocker les lignes de connexion entre les chapitres.
    const {data, loading, error} = useFetch(url); // Hook personnalisé pour effectuer la requête API.

    // Met à jour les chapitres du cours lorsque les données sont récupérées.
    useEffect(() => { if (data) setCourse(data); }, [data]);

    // Affiche les erreurs dans la console si une erreur survient.
    useEffect(() => { if (error) console.log(error); }, [error]);

    // Génère les angles des lignes de connexion entre les chapitres.
    useEffect(() => {
        if (course.length > 0) {
            setLineList(Array.from({length: course.length - 1}, (_, i) => i % 2 === 0 ? '45deg' : '-45deg'));
        }
    }, [course]);

    // Filtre les chapitres pour les colonnes gauche et droite.
    const leftChapters = useMemo(() => course.filter((_, i) => i % 2 === 0), [course]);
    const rightChapters = useMemo(() => course.filter((_, i) => i % 2 === 1), [course]);

    // Calcule la largeur des cercles représentant les chapitres.
    const screenWidth = Dimensions.get('window').width;
    const widthCircle = useMemo(() => screenWidth * 0.3, [screenWidth]);

    // Calcule la hauteur totale d'un chapitre (cercle + marges).
    const heightCourse = useMemo(() => widthCircle + 16 + 8, [widthCircle]);

    // Fonction pour naviguer vers le cadre d'un chapitre.
    const navigateCourseFrame = (id) => {
        navigate("CourseFrame", {chapterId: id, deckId});
    };

    return (
        <View style={styles.coursePage.view}>
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary}/>
            ) : (
                <>
                    {/* Colonne gauche */}
                    <View style={[styles.coursePage.view.sideColumn, {alignItems: "flex-end"}]}>
                        {leftChapters.map(chapter =>
                            <ChapterButton
                                chapter={chapter}
                                onPress={navigateCourseFrame}
                                style={{marginBottom: heightCourse}}
                                widthCircle={widthCircle}
                                colors={colors}
                                key={chapter.id_chapitre}
                            />
                        )}
                    </View>
                    {/* Colonne centrale avec les lignes */}
                    <View style={[
                        styles.coursePage.view.centerColumn,
                        {height: lineList.length * heightCourse, marginTop: 0.5 * heightCourse}
                    ]}>
                        {lineList.map((line, idx) =>
                            <View
                                key={idx}
                                style={[
                                    styles.coursePage.view.centerColumn.line,
                                    {transform: [{rotate: line}], width: Math.sqrt(2) * heightCourse}
                                ]}
                            />
                        )}
                    </View>
                    {/* Colonne droite */}
                    <View style={[styles.coursePage.view.sideColumn, {alignItems: "flex-end"}]}>
                        {rightChapters.map(chapter =>
                            <ChapterButton
                                chapter={chapter}
                                onPress={navigateCourseFrame}
                                style={{marginTop: heightCourse}}
                                widthCircle={widthCircle}
                                colors={colors}
                                key={chapter.id_chapitre}
                            />
                        )}
                    </View>
                </>
            )}
        </View>
    );
}
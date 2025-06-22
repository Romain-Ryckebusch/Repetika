/**
 * @file review.js
 * @description Composant React Native pour gérer la révision des cartes d'un deck.
 * @module Review
 */

import {View, Text, ActivityIndicator} from "react-native";
import styles from '../../../styles/game/courseIndex.style';
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import colors from "../../../styles/colors";
import Btn_Fill from "../../../components/btn_fill";
import {navigate} from "../../../navigation/NavigationService";
import config from "../../../config/config";
import useFetch from "../../../utils/useFetch";
import {AuthContext} from "../../../utils/AuthContext";

/**
 * @function Review
 * @description Composant principal pour afficher l'écran de révision des cartes d'un deck.
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.lessonId - Identifiant de la leçon associée.
 * @param {number} props.deckId - Identifiant du deck à réviser.
 * @returns {JSX.Element} Vue principale de l'écran de révision.
 */
export default function Review({lessonId, deckId}) {
    const {t} = useTranslation(); // Hook pour la traduction des textes.
    const {userId} = useContext(AuthContext); // Récupère l'identifiant utilisateur depuis le contexte d'authentification.
    const url = config.BASE_URL + `/main/start-session?user_id=${userId}&deck_id=${deckId}`; // URL de l'API pour démarrer une session de révision.

    const defaultDeck = []; // Deck par défaut (vide).
    const [deck, setDeck] = useState([]); // État pour stocker les cartes du deck.
    const [cardsNumber, setCardsNumber] = useState(0); // État pour stocker le nombre de cartes dans le deck.

    const {data, loading, error} = useFetch(url); // Hook personnalisé pour effectuer la requête API.

    /**
     * @function useEffect
     * @description Met à jour le deck et le nombre de cartes lorsque les données sont récupérées.
     */
    useEffect(() => {
        if (data) {
            setDeck(data);
            setCardsNumber(data.length);
        }
    }, [data]);

    /**
     * @function useEffect
     * @description Affiche les erreurs dans la console si une erreur survient.
     */
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    return (
        <View style={styles.reviewPage.view}>
            {
                loading ? (
                    // Affiche un indicateur de chargement si les données sont en cours de récupération.
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        {/* Texte principal affichant le nombre de cartes à réviser. */}
                        <Text style={styles.reviewPage.text}>
                            {t("courseIndexScreen.reviewMainTextStart")}
                            <Text style={{ color: colors.orange }}>{cardsNumber}</Text>
                            {t("courseIndexScreen.reviewMainTextEnd")}
                        </Text>
                        <View style={styles.reviewPage.interactView}>
                            {/* Bouton pour démarrer la révision. */}
                            <Btn_Fill
                                title={t("courseIndexScreen.reviewStartButtonText")}
                                onPress={() => navigate("ReviewFrame", { courseId: 1, deck })}
                                textStyle={{ fontFamily: 'OpenSans_Regular' }}
                            />
                            {/* Texte pour gérer les cartes de révision. */}
                            <Text style={styles.reviewPage.interactView.text}>
                                {t("courseIndexScreen.reviewManageReviewCard")}
                            </Text>
                        </View>
                    </>
                )
            }
        </View>
    );
}
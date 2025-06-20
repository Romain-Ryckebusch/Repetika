import {View, Text, ActivityIndicator} from "react-native";
import globalStyles from '../../../styles/global';
import styles from '../../../styles/game/courseIndex.style';
import ScreenWrapper from "../../../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {useContext, useEffect, useState} from "react";
import colors from "../../../styles/colors";
import Btn_Fill from "../../../components/btn_fill";
import {navigate} from "../../../navigation/NavigationService";
import config from "../../../config/config";
import useFetch from "../../../utils/useFetch";
import {AuthContext} from "../../../utils/AuthContext";

export default function Review({lessonId, deckId}) {
    const {t} = useTranslation();
    const {userId} = useContext(AuthContext);
    const url = config.BASE_URL + `/main/start-session?user_id=${userId}&deck_id=${deckId}`;


    const defaultDeck = [
        ];
    const [deck, setDeck] = useState([]);
    const [cardsNumber, setCardsNumber] = useState(0);

    const { data, loading, error } = useFetch(url);

    useEffect(() => {
        if (data) {
            setDeck(data);
            setCardsNumber(data.length);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    return (
        <View style={styles.reviewPage.view}>
            {
                loading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        <Text style={styles.reviewPage.text}>
                            {t("courseIndexScreen.reviewMainTextStart")}
                            <Text style={{ color: colors.orange }}>{cardsNumber}</Text>
                            {t("courseIndexScreen.reviewMainTextEnd")}
                        </Text>
                        <View style={styles.reviewPage.interactView}>
                            <Btn_Fill
                                title={t("courseIndexScreen.reviewStartButtonText")}
                                onPress={() => navigate("ReviewFrame", { courseId: 1, deck })}
                                textStyle={{ fontFamily: 'OpenSans_Regular' }}
                            />
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

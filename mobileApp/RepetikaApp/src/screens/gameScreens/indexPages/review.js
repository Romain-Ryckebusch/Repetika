import { View, Text, TouchableOpacity, ScrollView} from "react-native";

import globalStyles from '../../../styles/global';
import styles from '../../../styles/game/courseIndex.style';

import ScreenWrapper from "../../../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import {useState} from "react";
import colors from "../../../styles/colors";
import Btn_Fill from "../../../components/btn_fill";
import {navigate} from "../../../navigation/NavigationService";




export default function Review() {
    const {t}=useTranslation();

    const deck=[
        {
            "id":1,
            "front":"Quel président aime les pommes",
            "back":"Jaques Chirac",
            "correct":false,
        },{
            "id":2,
            "front":" # Qui est ce? \n ![test](https://i.etsystatic.com/8028751/r/il/8926c5/1976232850/il_fullxfull.1976232850_12te.jpg)",
            "back":"Notre Seigneur et Sauveur Jésus Christ",
            "correct":false,
        },{
            "id":3,
            "front":"Qui joue Mr Duchemin dans l'aile ou la cuisse?",
            "back":"Louis de Funes",
            "correct":false,
        }
    ]

    const cardsNumber = deck.length;



    return (
        <View style={styles.reviewPage.view}>
            <Text style={styles.reviewPage.text}>{t("courseIndexScreen.reviewMainTextStart")}<Text style={{color:colors.orange}}>{cardsNumber}</Text>{t("courseIndexScreen.reviewMainTextEnd")}</Text>
            <View style={styles.reviewPage.interactView}>
                <Btn_Fill  title={t("courseIndexScreen.reviewStartButtonText")} onPress={()=>navigate("ReviewFrame",{courseId:1,deck:deck})} textStyle={{fontFamily: 'OpenSans_Regular',}} />
                <Text style={styles.reviewPage.interactView.text} >{t("courseIndexScreen.reviewManageReviewCard")}</Text>
            </View>
        </View>
    )
}





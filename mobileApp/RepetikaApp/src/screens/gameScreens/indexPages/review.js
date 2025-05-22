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




export default function Review({cardsNumber}) {
    const {t}=useTranslation();





    return (
        <View style={styles.reviewPage.view}>
            <Text style={styles.reviewPage.text}>{t("courseIndexScreen.reviewMainTextStart")}<Text style={{color:colors.orange}}>{cardsNumber}</Text>{t("courseIndexScreen.reviewMainTextEnd")}</Text>
            <View style={styles.reviewPage.interactView}>
                <Btn_Fill  title={t("courseIndexScreen.reviewStartButtonText")} onPress={()=>navigate("ReviewFrame")} textStyle={{fontFamily: 'OpenSans_Regular',}} />
                <Text style={styles.reviewPage.interactView.text} >{t("courseIndexScreen.reviewManageReviewCard")}</Text>
            </View>
        </View>
    )
}





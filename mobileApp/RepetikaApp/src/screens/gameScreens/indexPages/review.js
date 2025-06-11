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

    const deck = [
        { id: 1, front: "What is the capital of Albania?", back: "Tirana", correct: true },
        { id: 2, front: "What is the capital of Andorra?", back: "Andorra la Vella", correct: true },
        { id: 3, front: "What is the capital of Armenia?", back: "Yerevan", correct: true },
        { id: 4, front: "What is the capital of Austria?", back: "Vienna", correct: false }, // 1
        { id: 5, front: "What is the capital of Azerbaijan?", back: "Baku", correct: true },
        { id: 6, front: "What is the capital of Belarus?", back: "Minsk", correct: true },
        { id: 7, front: "What is the capital of Belgium?", back: "Brussels", correct: true },
        { id: 8, front: "What is the capital of Bosnia and Herzegovina?", back: "Sarajevo", correct: true },
        { id: 9, front: "What is the capital of Bulgaria?", back: "Sofia", correct: true },
        { id: 10, front: "What is the capital of Croatia?", back: "Zagreb", correct: true },
        { id: 11, front: "What is the capital of Cyprus?", back: "Nicosia", correct: true },
        { id: 12, front: "What is the capital of Czech Republic?", back: "Prague", correct: true },
        { id: 13, front: "What is the capital of Denmark?", back: "Copenhagen", correct: true },
        { id: 14, front: "What is the capital of Estonia?", back: "Tallinn", correct: true },
        { id: 15, front: "What is the capital of Finland?", back: "Helsinki", correct: true },
        { id: 16, front: "What is the capital of France?", back: "Paris", correct: true },
        { id: 17, front: "What is the capital of Georgia?", back: "Tbilisi", correct: true },
        { id: 18, front: "What is the capital of Germany?", back: "Berlin", correct: true },
        { id: 19, front: "What is the capital of Greece?", back: "Athens", correct: true },
        { id: 20, front: "What is the capital of Hungary?", back: "Budapest", correct: false }, // 2
        { id: 21, front: "What is the capital of Iceland?", back: "Reykjavik", correct: true },
        { id: 22, front: "What is the capital of Ireland?", back: "Dublin", correct: true },
        { id: 23, front: "What is the capital of Italy?", back: "Rome", correct: true },
        { id: 24, front: "What is the capital of Kazakhstan?", back: "Astana", correct: true },
        { id: 25, front: "What is the capital of Kosovo?", back: "Pristina", correct: true },
        { id: 26, front: "What is the capital of Latvia?", back: "Riga", correct: true },
        { id: 27, front: "What is the capital of Liechtenstein?", back: "Vaduz", correct: false }, // 3
        { id: 28, front: "What is the capital of Lithuania?", back: "Vilnius", correct: true },
        { id: 29, front: "What is the capital of Luxembourg?", back: "Luxembourg", correct: true },
        { id: 30, front: "What is the capital of Malta?", back: "Valletta", correct: true },
        { id: 31, front: "What is the capital of Moldova?", back: "Chișinău", correct: true },
        { id: 32, front: "What is the capital of Monaco?", back: "Monaco", correct: true },
        { id: 33, front: "What is the capital of Montenegro?", back: "Podgorica", correct: true },
        { id: 34, front: "What is the capital of Netherlands?", back: "Amsterdam", correct: true },
        { id: 35, front: "What is the capital of North Macedonia?", back: "Skopje", correct: true },
        { id: 36, front: "What is the capital of Norway?", back: "Oslo", correct: true },
        { id: 37, front: "What is the capital of Poland?", back: "Warsaw", correct: true },
        { id: 38, front: "What is the capital of Portugal?", back: "Lisbon", correct: true },
        { id: 39, front: "What is the capital of Romania?", back: "Bucharest", correct: true },
        { id: 40, front: "What is the capital of Russia?", back: "Moscow", correct: true },
        { id: 41, front: "What is the capital of San Marino?", back: "San Marino", correct: true },
        { id: 42, front: "What is the capital of Serbia?", back: "Belgrade", correct: true },
        { id: 43, front: "What is the capital of Slovakia?", back: "Bratislava", correct: true },
        { id: 44, front: "What is the capital of Slovenia?", back: "Ljubljana", correct: true },
        { id: 45, front: "What is the capital of Spain?", back: "Madrid", correct: false }, // 4
        { id: 46, front: "What is the capital of Sweden?", back: "Stockholm", correct: true },
        { id: 47, front: "What is the capital of Switzerland?", back: "Bern", correct: true },
        { id: 48, front: "What is the capital of Turkey?", back: "Ankara", correct: true },
        { id: 49, front: "What is the capital of Ukraine?", back: "Kyiv", correct: true },
        { id: 50, front: "What is the capital of United Kingdom?", back: "London", correct: true },
        { id: 51, front: "What is the capital of Vatican City?", back: "Vatican City", correct: false }, // 5
    ];



    const cardsNumber = deck.filter((card)=>card.correct===false).length;
    const filtredDeck =  deck.filter((card)=>card.correct===false)


    return (
        <View style={styles.reviewPage.view}>
            <Text style={styles.reviewPage.text}>{t("courseIndexScreen.reviewMainTextStart")}<Text style={{color:colors.orange}}>{cardsNumber}</Text>{t("courseIndexScreen.reviewMainTextEnd")}</Text>
            <View style={styles.reviewPage.interactView}>
                <Btn_Fill  title={t("courseIndexScreen.reviewStartButtonText")} onPress={()=>navigate("ReviewFrame",{courseId:1,deck:filtredDeck})} textStyle={{fontFamily: 'OpenSans_Regular',}} />
                <Text style={styles.reviewPage.interactView.text} >{t("courseIndexScreen.reviewManageReviewCard")}</Text>
            </View>
        </View>
    )
}





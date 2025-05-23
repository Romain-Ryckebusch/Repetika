import {View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image} from "react-native";

import globalStyles from '../../styles/global';
import colors from '../../styles/colors';
import styles from '../../styles/game/reviewFrame.style';

import ScreenWrapper from "../../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import React, {useEffect, useState} from "react";
import Btn_Fill from "../../components/btn_fill";
import Input from "../../components/frm_input";
import {navigate} from "../../navigation/NavigationService";
import backIcon from "../../assets/icons/back.png";
import * as Progress from 'react-native-progress';


const deck=[
    {
        "id":1,
        "front":"En quelle année à eu lieu la bataille d'Austerlitz?",
        "back":"En 1805",
        "correct":false,
    },{
        "id":2,
        "front":"Quel maréchal est le traitre parmis les traitres?",
        "back":"Jean Baptiste Bernadotte",
        "correct":false,
    },{
        "id":3,
        "front":"Qui joue Mr Duchemin dans l'aile ou la cuisse?",
        "back":"Louis de Funes",
        "correct":false,
    }
]


export default function ReviewFrame() {
    const {t}=useTranslation();

    const totalCardsCount=deck.length;
    const [cardFace,setCardFace]=useState("front");
    const [answer,setAnswer]=useState("");
    const [isAnswerCorrect,setIsAnswerCorrect] = useState(true);
    const [isReviewSessionFinish,setIsReviewSessionFinish] = useState(false);
    const [correctCards,setCorrectCards] = useState(0);
    const [cardsToReviewRemaining,setCardsToReviewRemaining] = useState(totalCardsCount);
    const [cardToShow, setCardToShow] = useState(0);


    //Fin de la session
    useEffect(() => {
        if (cardsToReviewRemaining === 0) {
            setIsReviewSessionFinish(true);
        }
    }, [cardsToReviewRemaining]);



    function nextCard() {
        let i = 1;
        const total = deck.length;
        let attempts = 0;
        while (attempts < total) {
            const nextIndex = (cardToShow + i) % total;
            if (!deck[nextIndex].correct) {
                setCardToShow(nextIndex);
                return;
            }
            i++;
            attempts++;
        }
        setIsReviewSessionFinish(true);
    }


    function falseAnswer(){
        setIsAnswerCorrect(false);
        nextQuestion()
    }

    function goodAnswer(){
        setIsAnswerCorrect(true);
        const card = deck.find(item => item.id === deck[cardToShow].id);
        if (card) {
            console.log("correct");

            card.correct = true;
            setCorrectCards(prev=>prev+1);
            setCardsToReviewRemaining(prev=>prev-1);
        }

        nextQuestion()
    }


    function nextQuestion(){
        nextCard()
        setAnswer("");
        setCardFace("front");
    }





    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            {/*------------------Header------------------------*/}
            <View style={styles.header.questionHeaderContainer}>
                <View style={[styles.header.container,{justifyContent:"start"},{height: 60},{alignItems:"flex-end"}]}>
                    <Pressable style={[styles.header.backArrowBtn]} onPress={() =>navigate("CourseIndex")}>
                        <Image style={styles.header.backArrowImg} source={backIcon}></Image>
                    </Pressable>
                    <Text style={[styles.header.headerTitle,{paddingBottom:2}]}>Pays du monde</Text>
                </View>
                <Progress.Bar
                    style={[globalStyles.card_progressbar,styles.header.progressBar]}
                    height={16}
                    color="#F1C40F"
                    unfilledColor="#d9d9d9"
                    borderWidth={0}
                    progress={correctCards/totalCardsCount}
                    width={300}
                />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{flex:1}}>
                    {
                        (!isReviewSessionFinish)?(
                        (cardFace==="front")?(
                            <View style={styles.questionView}>
                                <Text style={globalStyles.corpus}>{deck[cardToShow].front}</Text>
                                <View style={styles.questionView.interactives}>
                                    <Input maxLength={256} onChangeText={setAnswer} value={answer} style={styles.questionView.interactives.input}/>
                                    <Btn_Fill title={(answer==="")?"Voir la réponse":"Valider"} onPress={()=>{setCardFace("back")}}/>
                                </View>
                            </View>
                        ):(
                            <>
                                <Text style={globalStyles.corpus}>{deck[cardToShow].front}</Text>

                                <View style={styles.answerViewToaster}>
                                    <Text style={styles.answerViewToaster.correctAnswerText}>Réponse correcte: {deck[cardToShow].back}</Text>
                                    {answer!==""?(
                                    <Text style={styles.answerViewToaster.userAnswerText}>Votre réponse: {answer}</Text>
                                        ):null}
                                    <View style={styles.answerViewToaster.interactives}>
                                        <Btn_Fill title={"Faux"} style={[styles.answerViewToaster.interactives.buttons,styles.answerViewToaster.interactives.wrongButton]} onPress={()=>{falseAnswer()}}/>
                                        <Btn_Fill title={"Vrai"} style={[styles.answerViewToaster.interactives.buttons,styles.answerViewToaster.interactives.correctButton]} onPress={()=>{goodAnswer()}}/>
                                    </View>
                                </View>
                            </>
                        )
                        ):(
                            <View style={styles.finishedSession}>
                                <Text style={[globalStyles.title,styles.finishedSession.splashText]}>Session terminée!</Text>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


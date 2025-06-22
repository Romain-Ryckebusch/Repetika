import {View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image} from "react-native";

import globalStyles from '../../styles/global';
import colors from '../../styles/colors';
import styles from '../../styles/game/reviewFrame.style';

import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Btn_Fill from "../../components/btn_fill";
import Input from "../../components/frm_input";
import backIcon from "../../assets/icons/back.png";
import * as Progress from 'react-native-progress';
import ConfettiCannon from 'react-native-confetti-cannon';
import {navigate} from "../../navigation/NavigationService";
import {useRoute} from "@react-navigation/native";
import Markdown from 'react-native-markdown-display';
import config from "../../config/config";
import {saveSession} from "../../utils/session";
import {AuthContext} from "../../utils/AuthContext";



export default function ReviewFrame() {
    const {t}=useTranslation();
    const route = useRoute();
    const courseId = route.params?.courseId;
    const deck = route.params?.deck;
    const {userId}= useContext(AuthContext);
    useEffect(() => {
        if (!courseId || !deck) {
            navigate("MainApp");
        }
    }, [courseId, deck]);

    const totalCardsCount=deck.length
    const [cardFace,setCardFace]=useState("front");
    const [answer,setAnswer]=useState("");
    const [isAnswerCorrect,setIsAnswerCorrect] = useState(true);
    const [isReviewSessionFinish,setIsReviewSessionFinish] = useState(false);
    const [correctCards,setCorrectCards] = useState(0);
    const [cardsToReviewRemaining,setCardsToReviewRemaining] = useState(totalCardsCount);
    const [cardToShow, setCardToShow] = useState(0);
    const [shoot, setShoot] = useState(false);
    const [falseCards,setFalseCards]=useState([]);

    //Fin de la session
    useEffect(() => {
        if (cardsToReviewRemaining === 0) {
            setIsReviewSessionFinish(true);
            setShoot(true);
        }
    }, [cardsToReviewRemaining]);


    async function updateCard(cardId, userId, value) {
        try {
            // Construction correcte de la structure JSON
            const payload = {
                metadata: {
                    user_id: userId,
                    results: {
                        [cardId]: value  // clé dynamique => { "6853...": 0 }
                    }
                }
            };


            const response = await fetch(config.BASE_URL + '/main/update-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.error) {
                console.error('Erreur côté serveur:', data.error);
            } else {

            }

        } catch (err) {
            console.error('Erreur fetch:', err);
        }
    }



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
        setFalseCards(prev=>[...prev,deck[cardToShow]._id]);
        nextQuestion()
    }

    function goodAnswer(){
        setIsAnswerCorrect(true);
        const card = deck.find(item => item._id === deck[cardToShow]._id);
        if (card) {


            if(falseCards.includes(card._id)){
                updateCard(card._id,userId,2)

            }else{
                updateCard(card._id,userId,0)

            }

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
        <>
        {/*------------------Header------------------------*/}
        <View style={styles.header.questionHeaderContainer}>
            <View style={[styles.header.container,{justifyContent:"start"},{height: 60},{alignItems:"flex-end"}]}>
                <Pressable style={[styles.header.backArrowBtn]} onPress={() =>navigate("CourseIndex")}>
                    <Image style={styles.header.backArrowImg} source={backIcon}></Image>
                </Pressable>
                <Text style={[styles.header.headerTitle,{paddingBottom:2}]}>European capitals</Text>
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >


            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{flex:1}}>
                    {(!isReviewSessionFinish)?(
                        (cardFace==="front")?(
                            <View style={styles.questionView}>
                                <Markdown>{deck[cardToShow].front}</Markdown>
                                <View style={styles.questionView.interactives}>
                                    <Input maxLength={256} onChangeText={setAnswer} value={answer} style={styles.questionView.interactives.input}/>
                                    <Btn_Fill title={(answer==="")?t("courseIndexScreen.reviewSeeAnswer"):t("courseIndexScreen.reviewValidate")} onPress={()=>{setCardFace("back")}}/>
                                </View>
                            </View>
                        ):(
                            <>
                                <View  style={{width:"80%",height:"60%", marginLeft:'10%'}}>
                                <Markdown>{deck[cardToShow].front}</Markdown>
                                </View>
                                <View style={styles.answerViewToaster}>
                                    <Text style={styles.answerViewToaster.correctAnswerText}>{t("courseIndexScreen.reviewCorrectAnswer")} {deck[cardToShow].back}</Text>
                                    {answer!==""?(
                                    <Text style={styles.answerViewToaster.userAnswerText}>{t("courseIndexScreen.reviewYourAnswer")} {answer}</Text>
                                        ):null}
                                    <View style={styles.answerViewToaster.interactives}>
                                        <Btn_Fill title={t("courseIndexScreen.reviewFalse")} style={[styles.answerViewToaster.interactives.buttons,styles.answerViewToaster.interactives.wrongButton]} onPress={()=>{falseAnswer()}}/>
                                        <Btn_Fill title={t("courseIndexScreen.reviewTrue")} style={[styles.answerViewToaster.interactives.buttons,styles.answerViewToaster.interactives.correctButton]} onPress={()=>{goodAnswer()}}/>
                                    </View>
                                </View>
                            </>
                        )
                        ):(
                            <View style={styles.finishedSession}>
                                <Text style={[globalStyles.title,styles.finishedSession.splashText]}>{t("courseIndexScreen.reviewSessionFinished")}</Text>
                                <Text style={[globalStyles.corpus,{textAlign: 'center'}]}>{t("courseIndexScreen.reviewFinishCardsStart")} <Text style={{color:colors.orange}}>{totalCardsCount}</Text> {t("courseIndexScreen.reviewFinishCardsEnd")}</Text>
                                <Btn_Fill title={t("courseIndexScreen.reviewBackToHome")} style={{width:'80%',marginHorizontal:'10%'}} onPress={()=>{navigate("endSessionChecks")}}/>
                                {shoot && (
                                    <ConfettiCannon
                                        count={100}
                                        origin={{ x: -10, y: 0 }}
                                        explosionSpeed={500}
                                        fadeOut={false}
                                        fallSpeed={5000}
                                    />
                                )}
                            </View>
                        )
                    }
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </>
    )
}


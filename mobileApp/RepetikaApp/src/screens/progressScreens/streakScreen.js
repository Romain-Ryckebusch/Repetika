import React, {useRef, useEffect, useState} from "react";
import {View, Text, Image, Animated, Pressable} from "react-native";
import styles from "../../styles/game/endSessionCheck.style";
import globalStyles from "../../styles/global";
import {PlatformPressable} from "@react-navigation/elements";
import Btn_Fill from "../../components/btn_fill";
import Btn_Empty from "../../components/btn_empty";
import {navigate} from "../../navigation/NavigationService";
import {useTranslation} from "react-i18next";

const streak = require("../../assets/icons/streakIcon.png");
const streakDisabled = require("../../assets/icons/streakIconDisabeld.png");

const StreakView = ({ streak, date ,onPress}) => {
    const {t}=useTranslation();


    const newStreak = streak + 1;
    const animatedStreakPos = newStreak >= 4 ? 3 : streak;
    let tab = [];
    const today = new Date();
    for (let i = 0; i < animatedStreakPos; i++){
        const dateForLetter = new Date(today);
        dateForLetter.setDate(today.getDate() - (animatedStreakPos - i));
        tab.push({status:"active",letter:firstLetterOfDay(dateForLetter,t("locale"))});
    }
    tab.push({status:"today",letter:firstLetterOfDay(today,t("locale"))});
    for (let i = animatedStreakPos + 1; i < 6; i++) {
        const dateForLetter = new Date(today);
        dateForLetter.setDate(today.getDate() +(i-animatedStreakPos));
        tab.push({status:"inactive",letter:firstLetterOfDay(dateForLetter,t("locale"))});
    }

    return (
        <View style={styles.container}>
            <Text style={globalStyles.title}>
                {t("EndSessionCheck.streakTitleStart")}{"\n"}
                <Text style={styles.streak.number}>{newStreak}</Text>
                {"\n"}{t("EndSessionCheck.streakTitleEnd")}
            </Text>

            <View style={styles.streak.list}>
                {tab.map((data, index) => (
                    <Streak key={index} data={data} />
                ))}
            </View>

            <View style={styles.streak.btn}>
                <Btn_Fill title={t("EndSessionCheck.Next")} onPress={onPress} />
                <Btn_Empty title={t("EndSessionCheck.Share")} style={styles.streak.btn.share}/>
            </View>
        </View>
    );
};

const Streak = ({ data }) => {
    if (data.status !== "today") {
        const source = data.status === "active" ? streak : streakDisabled;
        return (
            <View style={styles.streak.list.item}>
                <Image style={styles.streak.list.image} source={source} />
                <Text style={styles.streak.list.text}>{data.letter}</Text>
            </View>
        );
    } else {
        const fadeAnim = useRef(new Animated.Value(0)).current;
        const translateY = useRef(new Animated.Value(40)).current;
        const scale = useRef(new Animated.Value(0.8)).current;

        useEffect(() => {
            setTimeout(()=>{
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateY, {
                        toValue: 0,
                        friction: 4,
                        tension: 100,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        friction: 2,
                        tension: 100,
                        useNativeDriver: true,
                    }),
                ]).start();
            },500)
        }, []);

        return (
            <View style={styles.streak.list.item}>
                {/* Flamme grise */}
                <Image source={streakDisabled} style={styles.streak.list.image} />

                {/* Flamme orange animée */}
                <Animated.Image
                    source={streak}
                    style={[
                        styles.streak.list.image,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY },
                                { scale },
                            ],
                            position: "absolute",
                        },
                    ]}
                />
                <Text style={styles.streak.list.text}>{data.letter}</Text>
            </View>
        );
    }
};

function firstLetterOfDay(date, locale = 'fr-FR') {
    const nomJour = date.toLocaleDateString(locale, { weekday: 'long' });
    return nomJour.charAt(0).toUpperCase();
}

export default StreakView
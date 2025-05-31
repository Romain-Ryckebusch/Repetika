import React, { useRef, useEffect } from "react";
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

const StreakView = ({ streak, date }) => {
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
                <Btn_Fill title={t("EndSessionCheck.Next")} onPress={()=>navigate("endSessionChecks")} />
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

function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function isYesterday(dateAComparer) {
    const maintenant = new Date();

    // Date d'hier (à minuit)
    const hier = new Date(maintenant);
    hier.setDate(hier.getDate() - 1);
    hier.setHours(0, 0, 0, 0);

    // Date de fin d'hier (23:59:59)
    const finHier = new Date(hier);
    finHier.setHours(23, 59, 59, 999);

    // Comparaison
    return dateAComparer >= hier && dateAComparer <= finHier;
}

function firstLetterOfDay(date, locale = 'fr-FR') {
    const nomJour = date.toLocaleDateString(locale, { weekday: 'long' });
    return nomJour.charAt(0).toUpperCase();
}

const EndSessionChecks = () => {
    const initialPlayerData = {
        streak: 5,
        lastSessionDate: new Date("2025-05-30"),
    };

    if(isSameDate(initialPlayerData.lastSessionDate,new Date())) {
        navigate("CourseIndex")
    }else{
        let streakNumber = 0
        if(isYesterday(initialPlayerData.lastSessionDate)) {
            streakNumber = initialPlayerData.streak;
        }
        return (
            <StreakView
                streak={streakNumber}
                date={initialPlayerData.lastSessionDate}
            />
        );
    }
};

export default EndSessionChecks;

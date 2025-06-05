import { useTranslation } from "react-i18next";
import { Text, View, Animated } from "react-native";
import styles from "../../styles/game/endSessionCheck.style";
import globalStyles from "../../styles/global";
import React, { useEffect, useRef, useState } from "react";
import * as Progress from 'react-native-progress';
import colors from '../../styles/colors';

const XpView = ({ oldXp, addXp }) => {
    const { t } = useTranslation();

    const newXp = oldXp + addXp;
    const level = Math.floor(Math.sqrt(oldXp / 10));
    const nextLevel = level + 1;
    const xpLevel = Math.round(10 * (level ** 2));
    const xpNextLevel = Math.round(10 * (nextLevel ** 2));

    let deltaXp = xpNextLevel - xpLevel;
    let initialProgress = (oldXp - xpLevel) / deltaXp;
    let finalProgress = (newXp - xpLevel) / deltaXp;
    let newLevelReached = false;

    // Cas où on dépasse le niveau suivant
    if (newXp >= xpNextLevel) {
        newLevelReached = true;
        const levelAfter = nextLevel + 1;
        const xpLevelAfter = Math.round(10 * (levelAfter ** 2));
        deltaXp = xpLevelAfter - xpNextLevel;
        finalProgress = (newXp - xpNextLevel) / deltaXp;
    }

    const [progress, setProgress] = useState(initialProgress);
    const [animatedProgress, setAnimatedProgress] = useState(true);


    // TEXTE XP animation
    const translateY = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // TEXTE "Niveau atteint !" animation
    const secondTranslateY = useRef(new Animated.Value(20)).current;
    const secondOpacity = useRef(new Animated.Value(0)).current;
    const secondFontSize = useRef(new Animated.Value(8)).current;

    // Animation du texte +Xp
    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Animation barre de progression (niveau ou non)
    useEffect(() => {
        if (newLevelReached) {
            const timeout1 = setTimeout(() => setProgress(1), 1000);
            const timeout2 = setTimeout(() =>{ setAnimatedProgress(false); setProgress(0)}, 1800);
            const timeout3 = setTimeout(() => { setAnimatedProgress(true); setProgress(finalProgress)}, 2200);
            return () => {
                clearTimeout(timeout1);
                clearTimeout(timeout2);
                clearTimeout(timeout3);
            };
        } else {
            const timeout = setTimeout(() => setProgress(finalProgress), 1000);
            return () => clearTimeout(timeout);
        }
    }, [newLevelReached]);

    // Animation "Niveau atteint !"
    useEffect(() => {
        if (newLevelReached) {
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(secondTranslateY, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(secondOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(secondFontSize, {
                        toValue: 48,
                        duration: 500,
                        useNativeDriver: false, // fontSize ne peut pas être animé en natif
                    }),
                ]).start();
            }, 1300);

            return () => clearTimeout(timer);
        }
    }, [newLevelReached]);

    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, { width: "80%" }]}>
                Bravo!{"\n"}Tu es en route vers le niveau <Text style={styles.xp.titleLevel}>{nextLevel}</Text> !
            </Text>

            {newLevelReached && (
                <Animated.Text
                    style={{
                        transform: [{ translateY: secondTranslateY }],
                        opacity: secondOpacity,
                        fontSize: secondFontSize,
                        color: colors.orange,
                        textAlign: 'center',
                        marginTop: 10,
                    }}
                >
                    Niveau {nextLevel} atteint !
                </Animated.Text>
            )}

            <View style={styles.xp.container}>
                <Animated.Text
                    style={[
                        styles.xp.xpAddedNumber,
                        {
                            transform: [{ translateY }],
                            opacity: opacity,
                        },
                    ]}
                >
                    +{addXp}xp
                </Animated.Text>

                <View style={styles.xp.progressView}>
                    <Text style={styles.xp.levelNumber}>{level}</Text>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Progress.Bar
                            height={40}
                            color="#f1c40f"
                            unfilledColor="#d9d9d9"
                            borderWidth={0}
                            progress={progress}
                            animated={animatedProgress}
                            width={null}
                            borderRadius={20}
                        />
                    </View>
                    <Text style={styles.xp.levelNumber}>{nextLevel}</Text>
                </View>
            </View>
        </View>
    );
};

export default XpView;

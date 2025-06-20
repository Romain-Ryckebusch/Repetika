import { useTranslation } from "react-i18next";
import { Text, View, Animated } from "react-native";
import styles from "../../styles/game/endSessionCheck.style";
import globalStyles from "../../styles/global";
import React, { useEffect, useRef, useState } from "react";
import * as Progress from 'react-native-progress';
import colors from '../../styles/colors';
import Btn_Fill from "../../components/btn_fill";
import * as XPF from "../../utils/ProgressFunctions"
const XpView = ({ oldXp, addXp,nextAction }) => {
    const { t } = useTranslation();

    const newXp = oldXp + addXp;
    const level = XPF.XpToLevelFunction(oldXp)
    let nextLevel = level + 1;
    const xpLevel = XPF.LevelToXpFunction(level);
    let xpNextLevel = XPF.LevelToXpFunction(nextLevel)

    const [firstLevelDisplay, setFirstLevelDisplay] = useState(level);
    const [secondLevelDisplay, setSecondLevelDisplay] = useState(nextLevel);

    let deltaXp = xpNextLevel - xpLevel;
    let initialProgress = (oldXp - xpLevel) / deltaXp;
    let finalProgress = (newXp - xpLevel) / deltaXp;
    let newLevelReached = false;
    let numberOfNewLevels = 0;

    // Cas où on dépasse le niveau suivant
    while (newXp >= xpNextLevel) {
        newLevelReached = true;
        const levelAfter = nextLevel + 1;
        nextLevel++;
        const xpLevelAfter = XPF.LevelToXpFunction(levelAfter)
        deltaXp = xpLevelAfter - xpNextLevel;
        finalProgress = (newXp - xpNextLevel) / deltaXp;
        xpNextLevel = xpLevelAfter;
        numberOfNewLevels++;
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


    useEffect(() => {

        if (newLevelReached) {
            const timeouts = [];

            for (let i = 0; i < numberOfNewLevels; i++) {
                // Démarre la progression
                const t1 = setTimeout(() => setProgress(1), 1000 + i * 1000);
                timeouts.push(t1);

                // Reset et affichage des niveaux
                const t2 = setTimeout(() => {
                    setAnimatedProgress(false);
                    setProgress(0);
                    setFirstLevelDisplay(nextLevel - (numberOfNewLevels-i));
                    setSecondLevelDisplay(nextLevel- (numberOfNewLevels-i)+1);
                }, 1800 + i * 1800);
                timeouts.push(t2);
            }

            // Progression finale
            const t3 = setTimeout(() => {
                setAnimatedProgress(true);
                setProgress(finalProgress);
            }, 2200 + (newLevelReached) * 2200);
            timeouts.push(t3);

            // Nettoyage
            return () => {
                timeouts.forEach(clearTimeout);
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
                {t("XpPage.CongratMessage")}
                 <Text style={styles.xp.titleLevel}>{nextLevel}</Text> !
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
                    {t('XpPage.Level', { level: nextLevel-1 })}
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
                    <Text style={styles.xp.levelNumber}>{firstLevelDisplay}</Text>
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
                    <Text style={styles.xp.levelNumber}>{secondLevelDisplay}</Text>
                </View>
            </View>

            <Btn_Fill title={t("XpPage.Next")} style={{width:'80%'}} onPress={nextAction}/>
        </View>
    );
};

export default XpView;

import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import globalStyles from "../styles/global";
import { useNavigation, useRoute } from "@react-navigation/native";

import Input from "../components/frm_input";
import Btn_Fill from "../components/btn_fill";
import TrophyItem from "../components/trophy_item";
import ScreenWrapper from "../components/navigation/screenWrapper";
import * as Progress from 'react-native-progress';

import styles from "../styles/UserProfileScreen.style";
import * as XPF from "../utils/ProgressFunctions";

function removeFriend() {
    console.log("remove friend");
};

export default function UserProfileScreen(props) {
    const {t}=useTranslation();

    const navigation = useNavigation();
    const route = useRoute();

    const UserId = 3; // TODO : get userId from context
    const userId = route.params?.userId; // gets the userId of this page from the route params


    const accountData={
        "userName":"aymericD59",
        "firstName":"Aymeric",
        "name":"Droulers",
        "mail":"aymeric.droulers@gmail.com",
        "profilePicture":require('../assets/Profile.png'),
        "accountCreationDate":"19/02/2025",
        "streaks":10,
        "xp":1400

    }

    const xpData = XPF.XpAllDataFunction(accountData.xp)
    const progress = xpData.progress;
    const lvl = xpData.level

    useEffect(() => {
        if (!userId) {
            navigation.goBack();
        }else if (userId === UserId) {
            navigation.navigate("MainApp", { screen: "Profile" });
        }
    }, [userId, navigation]);

    if (!userId) return null;

    const streakIcon = require('../assets/icons/streakIcon.png');

    const userName = "Louis"; // TODO : get userName from userId
    const userAccountCreationDate = "19/02/2025"; // TODO : get accountCreationDate from userId
    const userTrophies = [
        { label: "Apprenant", unlocked: true, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
        { label: "Thierry", unlocked: false, corpus: "Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol.", date: "21/05/2025" },
        { label: "Fraise", unlocked: false, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
        { label: "Poulet", unlocked: false, corpus: "Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol.", date: "21/05/2025" },
        { label: "Requin", unlocked: true, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
        { label: "Mayonnaise", unlocked: false, corpus: "On A Escalator", date: "22/05/2025" },
        { label: "Turbo", unlocked: false, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
        { label: "Russie", unlocked: false, corpus: "Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol.", date: "21/05/2025" }
    ]; // TODO : get trophies from userId
    const userLevel = 5; // TODO : get level from userId
    const userProgress = 0.2; // TODO : get progress from userId
    const userStreak = 10; // TODO : get streak from userId

    // Fonction utilitaire pour découper le tableau en sous-tableaux de 4
    function chunkArray(array, size) {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }
    const trophyRows = chunkArray(userTrophies, 4);


    return (
        <ScreenWrapper scrollable style={styles.container}>
            
            <View>
                <Text style={globalStyles.corpus}>{"TEMP_DEV /// userId : " + userId}</Text>
            </View>
    
            <Text style={globalStyles.title}>{accountData.userName}</Text>

             <Text style={globalStyles.subtitle}>{t("userProfileScreen.section_info_title")}</Text>
            <View style={styles.generalInfo_container}>

                <Image source={require('../assets/Profile.png')} style={styles.profilePicture} />

                <View style={styles.generalInfo_Right}>
                    <Text style={styles.generalInfo_name}>{accountData.userName}</Text>
                    <Text style={styles.generalInfo_accountCreation}>{t("userProfileScreen.section_info_accountDate",{date:accountData.accountCreationDate})}</Text>
                    
                    <View style={styles.streakSection}>
                        <Text>{accountData.streaks}</Text>
                        <Image style={styles.streakIcon} source={streakIcon}></Image>
                    </View>

                    <View style={styles.levelSection}>
                        <Progress.Bar
                            style={[globalStyles.card_progressbar, styles.progressBar]}
                            height={16}
                            color="#F1C40F"
                            unfilledColor="#d9d9d9"
                            borderWidth={0}
                            progress={progress}
                        />
                        <View style={styles.circle}>
                            <Text>{lvl}</Text>
                        </View>
                    </View>
                </View>

            </View>

            <Text style={[globalStyles.subtitle, {marginTop:30}]}>{t("userProfileScreen.section_trophies_title")}</Text>
            <View style={styles.trophy_container}>
                {trophyRows.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        <View style={styles.trophy_row}>
                            {row.map((trophy, index) => (
                                <TrophyItem
                                    key={trophy.label}
                                    label={trophy.label}
                                    unlocked={trophy.unlocked}
                                    corpus={trophy.corpus}
                                    date={trophy.date}
                                />
                            ))}
                        </View>
                        {rowIndex < trophyRows.length && (
                            <View style={styles.shelf}></View>
                        )}
                    </React.Fragment>
                ))}
            </View>

            <Btn_Fill
                title={t("userProfileScreen.section_removeFriend")}
                onPress={() => {
                    removeFriend();
                }}
                style={styles.editPictureBtn}
            />

        </ScreenWrapper>
    )
}



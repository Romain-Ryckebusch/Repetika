import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from "react-native";
import globalStyles from '../styles/global';
import styles from '../styles/ProfileScreen.style';
import * as Progress from 'react-native-progress';

import Input from "../components/frm_input";
import Btn_Fill from "../components/btn_fill";

import TrophyItem from "../components/trophy_item";
import ScreenWrapper from "../components/navigation/screenWrapper";
import { pickImageAsync } from "../components/pickImage";

import { useTranslation } from "react-i18next";

function getNewProfilePicture() {
    pickImageAsync()
        .then((uri) => {
            if (uri) { 
                const formData = new FormData();
                formData.append('photo', {
                    uri,
                    name: 'photo.jpg',
                    type: 'image/jpeg',
                });
                
                console.log("Image URI:", uri);
                /*
                const response = await fetch('https://ton-api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });
                */
            }
        });
}


export default function ProfileScreen() {
    const { t } = useTranslation();
    const streakIcon = require('../assets/icons/streakIcon.png');

    return (
        <ScreenWrapper scrollable style={styles.container}>
    
            <Text style={globalStyles.title}>{t("profileScreen.title")}</Text>

            <Text style={globalStyles.subtitle}>{t("profileScreen.section_trophies_title")}</Text>
            <View style={styles.trophy_container}>
                <View style={styles.trophy_row}>
                    <TrophyItem label="Apprenant" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                    <TrophyItem label="Thierry" unlocked={true} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                    <TrophyItem label="Fraise" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                    <TrophyItem label="Poulet" unlocked={true} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                </View>
                <View style={styles.shelf}></View>
                <View style={styles.trophy_row}>
                    <TrophyItem label="Requin" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                    <TrophyItem label="Mayonnaise" unlocked={true} corpus="On A Escalator" date="22/05/2025"/>
                    <TrophyItem label="Turbo" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                    <TrophyItem label="Russie" unlocked={false} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                </View>
                <View style={styles.shelf}></View>
            </View>


            <Text style={globalStyles.subtitle}>{t("profileScreen.section_info_title")}</Text>
            <View style={styles.generalInfo_container}>

                <Image source={require('../assets/Profile.png')} style={styles.profilePicture} />

                <View style={styles.generalInfo_Right}>
                    <Text style={styles.generalInfo_name}>Louis</Text>
                    <Text style={styles.generalInfo_accountCreation}>{t("profileScreen.section_info_accountDate",{date:"19/02/2025"})}</Text>
                    
                    <View style={styles.streakSection}>
                        <Text>10</Text>
                        <Image style={styles.streakIcon} source={streakIcon}></Image>
                    </View>

                    <View style={styles.levelSection}>
                        <Progress.Bar
                            style={[globalStyles.card_progressbar, styles.progressBar]}
                            height={16}
                            color="#F1C40F"
                            unfilledColor="#d9d9d9"
                            borderWidth={0}
                            progress={20}
                        />
                        <View style={styles.circle}>
                            <Text>5</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.editPictureBtn} onPress={() => getNewProfilePicture()}>
                        <Text style={styles.editPictureBtnText}>{t("profileScreen.section_info_editBtn")}</Text>
                    </TouchableOpacity>

                    </View>

            </View>


            <View style={styles.editableInfos_Form}>
                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.username")}</Text>
                <Input
                    placeholder={"K"}
                    onChangeText={() => {}}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.surname")}</Text>
                <Input
                    placeholder={"name"}
                    onChangeText={() => {}}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.mail")}</Text>
                <Input
                    placeholder={"name"}
                    onChangeText={() => {}}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.password")}</Text>
                <Input
                    placeholder={"name"}
                    onChangeText={() => {}}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.passwordConfirm")}</Text>
                <Input
                    placeholder={"name"}
                    onChangeText={() => {}}
                    style={styles.input}>
                </Input>
            </View>

            <Btn_Fill title={t("profileScreen.section_info.editBtn")} onPress={() => console.log('cliqué')} style={styles.saveBtn}/>

        </ScreenWrapper>
    )
}


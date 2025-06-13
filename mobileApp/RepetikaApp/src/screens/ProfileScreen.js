import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from "react-native";
import globalStyles from '../styles/global';
import styles from '../styles/ProfileScreen.style';
import colors from '../styles/colors';
import * as Progress from 'react-native-progress';

import Input from "../components/frm_input";
import Btn_Fill from "../components/btn_fill";

import TrophyItem from "../components/trophy_item";
import ScreenWrapper from "../components/navigation/screenWrapper";
import { pickImageAsync } from "../components/pickImage";

import { useTranslation } from "react-i18next";
import * as XPF from "../utils/ProgressFunctions";
import {clearSession} from "../utils/session";
import * as navigation from "../navigation/NavigationService";


/**
 * getNewProfilePicture - function to get a new profile picture.
 * It uses the pickImageAsync function to open the image picker and get the URI of the selected image.
 * Then, it creates a FormData object to send the image to the server.
 * The image is appended to the FormData object with the key 'photo'.
 */
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
                /* Here is an example of how to send the image to a server using fetch:
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

const userTrophies = [
    { label: "Apprenant", unlocked: true, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
    { label: "Jambe", unlocked: false, corpus: "Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol.", date: "21/05/2025" },
    { label: "Fraise", unlocked: true, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
    { label: "Poulet", unlocked: false, corpus: "Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol.", date: "21/05/2025" },
    { label: "Requin", unlocked: true, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
    { label: "Mayonnaise", unlocked: true, corpus: "On A Escalator", date: "22/05/2025" },
    { label: "Turbo", unlocked: false, corpus: "Vous vous êtes inscrit(e) sur Repetika.", date: "19/05/2025" },
    { label: "Russie", unlocked: false, corpus: "Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol.", date: "21/05/2025" },
]; // TODO : get trophies from userId


// Découper le tableau en sous-tableaux de 4
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
const trophyRows = chunkArray(userTrophies, 4);

function saveUserChanges() {
    console.log('Entregistrement des modifications utilisateur');
}

function disconnect(){
    clearSession().then(
        navigation.navigate('Auth', {
            screen: 'Login'
        })
    )
}

/**
 * ProfileScreen - login screen with user fields, password, and options for forgotten password and registration.
 */
export default function ProfileScreen() {
    const { t } = useTranslation();
    const streakIcon = require('../assets/icons/streakIcon.png');

    const profileData={
        "userName":"aymericD59",
        "firstName":"Aymeric",
        "name":"Droulers",
        "mail":"aymeric.droulers@gmail.com",
        "profilePicture":require('../assets/Profile.png'),
        "accountCreationDate":"19/02/2025",
        "streaks":10,
        "xp":7900

    }

    const [userName,setUserName] = useState(profileData.userName);
    const [firstName,setFirstName] = useState(profileData.firstName);
    const [lastName, setLastName] = useState(profileData.name);
    const [email, setEmail] = useState(profileData.mail);
    const [password, setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const xpData = XPF.XpAllDataFunction(profileData.xp)
    const progress = xpData.progress;
    const lvl = xpData.level

    return (
        <ScreenWrapper scrollable style={styles.container}>
    
            <Text style={globalStyles.title}>{t("profileScreen.title")}</Text>

            <Text style={globalStyles.subtitle}>{t("profileScreen.section_trophies_title")}</Text>
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


            <Text style={[globalStyles.subtitle, {padding:30}]}>{t("profileScreen.section_info_title")}</Text>
            <View style={styles.generalInfo_container}>

                <Image source={profileData.profilePicture} style={styles.profilePicture} />

                <View style={styles.generalInfo_Right}>
                    <Text style={styles.generalInfo_name}>{profileData.firstName}</Text>
                    <Text style={styles.generalInfo_accountCreation}>{t("profileScreen.section_info_accountDate",{date:profileData.accountCreationDate})}</Text>
                    
                    <View style={styles.streakSection}>
                        <Text>{profileData.streaks}</Text>
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

                    <TouchableOpacity style={styles.editPictureBtn} onPress={() => getNewProfilePicture()}>
                        <Text style={styles.editPictureBtnText}>{t("profileScreen.section_info_editBtn")}</Text>
                    </TouchableOpacity>

                    </View>

            </View>


            <View style={styles.editableInfos_Form}>
                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.username")}</Text>
                <Input
                    value={userName}
                    onChangeText={setUserName}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.name")}</Text>
                <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.surname")}</Text>
                <Input
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.mail")}</Text>
                <Input
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}>
                </Input>

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.password")}</Text>
                <Input
                    placeholder={t("profileScreen.section_info.password")}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry={true}
                />

                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.passwordConfirm")}</Text>
                <Input
                    placeholder={t("profileScreen.section_info.password")}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
            </View>

            <Btn_Fill 
                title={t("profileScreen.section_info.editBtn")} 
                onPress={() => {
                    saveUserChanges();
                }} 
                style={styles.saveBtn}/>

            <Btn_Fill
                title={t("profileScreen.section_info.disconnectBtn")}
                onPress={() => {
                    disconnect();
                }}
                style={[styles.saveBtn,{backgroundColor:colors.red}]}/>

        </ScreenWrapper>
    )
}


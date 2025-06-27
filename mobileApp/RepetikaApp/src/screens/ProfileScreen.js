import React, {useState, useContext, useEffect} from 'react';
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
import useFetch from '../utils/useFetch';
import {AuthContext} from "../utils/AuthContext";
import Config from "../config/config";


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
    { label: "L'étudiant", unlocked: false, corpus: "Avoir importé 3 cours dans l'application" },
    { label: "Créateur", unlocked: true, corpus: "Créer un cours" },
    { label: "Compétiteur", unlocked: false, corpus: "Être premier parmi ses amis (XP) 10 jours de suite" },
    { label: "Dès le matin !", unlocked: true, corpus: "Etudier entre 5h et 8h du matin" },
    { label: "Toute la nuit", unlocked: true, corpus: "Etudier entre minuit et 3 heures" },
    { label: "Semaine enflammée", unlocked: true, corpus: "Etudier tous les jours pendant une semaine" },
    { label: "Mois studieux", unlocked: true, corpus: "Etudier tous les jours pendant un mois" },
    { label: "Nouvelle ère", unlocked: false, corpus: "Etudier tous les jours pendant un an" },
    { label: "Le savoir est une arme", unlocked: false, corpus: "Etudier tous les jours pendant 1000 jours" },
    { label: "Multi-taches", unlocked: true, corpus: "Etudier 3 cours en même temps" },
    { label: "Curieux", unlocked: false, corpus: "Etudier 5 cours en même temps" },
];

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
        "userName":"...",
        "firstName":"Aymeric",
        "name":"Droulers",
        "mail":"...",
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

    const {userId}=useContext(AuthContext);
    console.log(userId);

    // Appel API pour récupérer username et mail
    const { data: userInfo, loading: userLoading, error: userError } = useFetch(Config.BASE_URL+'/main/getInfos/?id_user='+userId);

    console.log(Config.BASE_URL+'/api/auth/getInfos/?id_user='+userId)

    useEffect(() => {
        if(userInfo){
            console.log("User Info:", userInfo);
            setUserName(userInfo.username || profileData.userName);
            setEmail(userInfo.email || profileData.mail);
        }
    }, [userInfo]);

    return (
        <ScreenWrapper>
            <Text style={globalStyles.title}>{t("profileScreen.title")}</Text>

            { /*  <Text style={globalStyles.subtitle}>{t("profileScreen.section_trophies_title")}</Text>
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
*/}

            <Text style={[globalStyles.subtitle, {padding:30}]}>{t("profileScreen.section_info_title")}</Text>
            <View style={styles.generalInfo_container}>
                {userLoading && <Text>Chargement...</Text>}
                {userError && <Text>Erreur lors du chargement</Text>}
            </View>


            <View style={styles.editableInfos_Form}>
                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.username")} : {userName}</Text>
                {/* <Input
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
*/}
                <Text style={styles.generalInfo_name}>{t("profileScreen.section_info.mail")} : {email}</Text>
                {/*<Input
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
                />*/}
            </View>

            {/* <Btn_Fill
                title={t("profileScreen.section_info.editBtn")} 
                onPress={() => {
                    saveUserChanges();
                }} 
                style={styles.saveBtn}/>
*/}
            <Btn_Fill
                title={t("profileScreen.section_info.disconnectBtn")}
                onPress={() => {
                    disconnect();
                }}
                style={[styles.saveBtn,{backgroundColor:colors.red}]}/>

        </ScreenWrapper>
    )
}

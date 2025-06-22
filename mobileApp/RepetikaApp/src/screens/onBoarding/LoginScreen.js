import { View, Text, Pressable } from "react-native";
import globalStyles from '../../styles/global';
import styles from '../../styles/LoginScreen.style';


import Decoration from "../../components/decoration";
import {TouchableOpacity} from "react-native";

import Input from "../../components/frm_input";
import Btn_Fill from "../../components/btn_fill";

import ScreenWrapper from "../../components/navigation/screenWrapper";

import { useTranslation } from "react-i18next";
import {navigate} from "../../navigation/NavigationService";
import { useNavigation } from '@react-navigation/native';
import {getSession, saveSession} from "../../utils/session";
import {useState} from "react";
import config from "../../config/config";
import { useContext } from 'react';
import { AuthContext } from "../../utils/AuthContext"



export default function LoginScreen() {
    const {t}=useTranslation();
    const navigation = useNavigation();
    const { setTokenAccess, setTokenRefresh, setUserId, setUserStats } = useContext(AuthContext);


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [wrongPasswordError, setWrongPasswordError] = useState("");
    const [networkError, setNetworkError] = useState("");


    const loginFunction = async () => {
        try {
            const response = await fetch(config.BASE_URL + '/main/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();


            if(data.error){
                setWrongPasswordError(t('LoginScreen.passError'))
            }else{
                setNetworkError("");
                setWrongPasswordError("");
                await saveSession(data.tokens.access, data.tokens.refresh, data.user_id);


                // Met à jour le contexte
                setTokenAccess(data.tokens.access);
                setTokenRefresh(data.tokens.refresh);
                setUserId(data.user_id);

// Tu peux reconstruire les stats comme tu le fais dans saveSession
                const userStats = {
                    friendCount: 1,
                    studyStreak: 0,
                    importedCourses: 0,
                    createdCourses: 0,
                    lastStudyDate: '2025/06/06',
                    activeCourses: 0,
                    name: 'Aymeric',
                    unlockedAchievements: [],
                };
                setUserStats(userStats);
                navigation.navigate('MainApp', { screen: 'Home' });
            }





        } catch (err) {
            setNetworkError(t('LoginScreen.error'))
        }
    }


    return (
        <ScreenWrapper scrollable>

            <Decoration radius={900} top={400} left={100} />

            <View style={styles.container}>

                <Text style={globalStyles.title}>{t('LoginScreen.title')}</Text>
                <Text style={styles.subtitle}>{t('LoginScreen.subtitle')}</Text>

                <View style={styles.inputContainer}>
                    <View style={[styles.inputContainerLefter]}>
                        <Text style={styles.label}>{t('LoginScreen.username_mail')}</Text>
                        <Input
                            //placeholder={t('LoginScreen.username')}
                            value={username}
                            onChangeText={setUsername}
                        />

                        <Text style={styles.label}>{t('LoginScreen.password')}</Text>
                        <Input
                            //placeholder={t('LoginScreen.password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />


                        <Text style={styles.label_error}>{wrongPasswordError}</Text>
                        <Text style={styles.label_error}>{networkError}</Text>
                        
                        <Btn_Fill
                        style={{ marginTop: 20 }}
                        title={t('LoginScreen.loginBtn')}
                        onPress={() =>loginFunction()}
                        />
                    </View>
                </View>

                <Text style={styles.ask_label}>{t('LoginScreen.forgotPassword')}</Text>
                <Text onPress={()=>navigate("RegisterScreen")} style={styles.ask_label}>{t('LoginScreen.register')}</Text>

            </View>
        </ScreenWrapper>
    )
}


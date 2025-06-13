import { View, Text, Pressable } from "react-native";
import globalStyles from '../../styles/global';
import styles from '../../styles/LoginScreen.style';


import Decoration from "../../components/decoration";

import Input from "../../components/frm_input";
import Btn_Fill from "../../components/btn_fill";

import ScreenWrapper from "../../components/navigation/screenWrapper";

import { useTranslation } from "react-i18next";
import {navigate} from "../../navigation/NavigationService";
import { useNavigation } from '@react-navigation/native';
import {getSession, saveSession} from "../../utils/session";
import {useState} from "react";
import config from "../../config/config";


export default function LoginScreen() {
    const {t}=useTranslation();
    const navigation = useNavigation();


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [wrongPasswordError, setWrongPasswordError] = useState("");
    const [networkError, setNetworkError] = useState("");

    const loginFunction = async () => {
        try {
            const response = await fetch(config.BASE_URL + '/auth/login/', {
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

            // Tu peux ici vérifier et utiliser les données reçues
            console.log('Données reçues:', data);

            if(data.error){
                setWrongPasswordError(t('LoginScreen.passError'))
            }else{
                setNetworkError("");
                setWrongPasswordError("");
                await saveSession(data.tokens.access, data.tokens.refresh, data.user_id)
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


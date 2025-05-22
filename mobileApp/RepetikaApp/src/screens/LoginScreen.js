import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import globalStyles from '../styles/global';
import styles from '../styles/LoginScreen.style';
import * as Progress from 'react-native-progress';

import Input from "../components/frm_input";
import Btn_Fill from "../components/btn_fill";

import ScreenWrapper from "../components/navigation/screenWrapper";

import { useTranslation } from "react-i18next";


export default function HomeScreen() {
    const {t}=useTranslation();
    return (
        <ScreenWrapper scrollable>
            <View style={styles.container}>

                <Text style={globalStyles.title}>{t('LoginScreen.title')}</Text>
                <Text style={styles.subtitle}>{t('LoginScreen.subtitle')}</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('LoginScreen.username_mail')}</Text>
                    <Input placeholder={t('LoginScreen.username')} />

                    <Text style={styles.label}>{t('LoginScreen.password')}</Text>
                    <Input placeholder={t('LoginScreen.password')} />

                    <Text style={styles.label}>{t('LoginScreen.passwordConfirm')}</Text>
                    
                    <Btn_Fill
                    style={{ marginTop: 20 }}
                    title={t('LoginScreen.loginBtn')}
                    onPress={() => { }}
                    />
                </View>
                

                <Text style={styles.ask_label}>{t('LoginScreen.forgotPassword')}</Text>
                <Text style={styles.ask_label}>{t('LoginScreen.register')}</Text>
                
            </View>
        </ScreenWrapper>
    )
}


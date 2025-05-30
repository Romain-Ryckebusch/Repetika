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

export default function LoginScreen() {
    const {t}=useTranslation();
    const navigation = useNavigation();
    return (
        <ScreenWrapper scrollable>

            <Decoration radius={900} top={400} left={100} />

            <View style={styles.container}>

                <Text style={globalStyles.title}>{t('LoginScreen.title')}</Text>
                <Text style={styles.subtitle}>{t('LoginScreen.subtitle')}</Text>

                <View style={styles.inputContainer}>
                    <View style={[styles.inputContainerLefter]}>
                        <Text style={styles.label}>{t('LoginScreen.username_mail')}</Text>
                        <Input placeholder={t('LoginScreen.username')} />

                        <Text style={styles.label}>{t('LoginScreen.password')}</Text>
                        <Input placeholder={t('LoginScreen.password')} />


                        <Text style={styles.label_error}>{t('LoginScreen.passError')}</Text>
                        <Text style={styles.label_error}>{t('LoginScreen.error')}</Text>
                        
                        <Btn_Fill
                        style={{ marginTop: 20 }}
                        title={t('LoginScreen.loginBtn')}
                        onPress={() =>navigation.navigate('MainApp', {
                            screen: 'Home'
                        })}
                        />
                    </View>
                </View>

                <Text style={styles.ask_label}>{t('LoginScreen.forgotPassword')}</Text>
                <Text onPress={()=>navigate("RegisterScreen")} style={styles.ask_label}>{t('LoginScreen.register')}</Text>

            </View>
        </ScreenWrapper>
    )
}


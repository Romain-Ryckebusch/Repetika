import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from "react-native";
import globalStyles from '../../styles/global';

import styles from '../../styles/Register.style';


import ScreenWrapper from "../../components/navigation/screenWrapper";

import Input from "../../components/frm_input";
import Btn_Fill from "../../components/btn_fill";
import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';
import Decoration from "../../components/decoration";
import {useState} from "react";
import config from "../../config/config";




export default function RegisterScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [userName, setUserName] = useState("");
    const [Mail,setMail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const [usernameError, setUsernameError] = useState("");
    const [mailError, setMailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");


    const register = () => {
        let valid = true;

        if (userName.length < 3 || userName.length > 64) {
            setUsernameError(t("Register.errors.username"));
            valid = false;
        } else {
            setUsernameError("");
        }

        if (Mail.length === 0 || Mail.length > 128 || !Mail.includes("@")) {
            setMailError(t("Register.errors.mail"));
            valid = false;
        } else {
            setMailError("");
        }

        if (password.length < 6 || password.length > 128) {
            setPasswordError(t("Register.errors.password"));
            valid = false;
        } else {
            setPasswordError("");
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError(t("Register.errors.confirmPassword"));
            valid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (valid) {
            fetch(config.BASE_URL+'/main/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username":userName,
                    "email":Mail,
                    "password":password
                })
            })
                .then(res => res.json())
                .then(res=>{
                    console.log(res)
                    if (res.message="User created successfully") {
                        Alert.alert(t("Register.success"));
                        navigation.navigate("Login");
                    } else {
                        if (res.detail.error === "Username already taken.") {
                            setUsernameError(t("Register.errors.usernameExists"));
                        } else if (res.error === "email_exists") {
                            setMailError(t("Register.errors.mailExists"));
                        } else {
                            console.error('Erreur lors de l\'inscription :', res.error);
                        }
                    }
                })
                .catch(err => console.error('Erreur :', err));
          //  navigation.navigate("UserPreferences");
        }
    };


    return (
        <ScreenWrapper scrollable >
            <Decoration radius={800} top={-300} left={-600} />
            <View style={styles.container}>
                <Text style={globalStyles.title}>{t("Register.title")}</Text>
                <Text style={styles.subtitle}>{t("Register.subtitle")}</Text>

                <View style={styles.editableInfos_Form}>
                    <Text style={styles.generalInfo_name}>{t("Register.section_info.username")}</Text>
                    <Input
                        placeholder={"user127"}
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.input}>
                    </Input>
                    {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.mail")}</Text>
                    <Input
                        placeholder={"exemple@gmail.com"}
                        value={Mail}
                        onChangeText={setMail}
                        style={styles.input}>
                    </Input>
                    {mailError ? <Text style={styles.errorText}>{mailError}</Text> : null}

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.password")}</Text>
                    <Input
                        placeholder={"not 123"}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}>
                    </Input>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.passwordConfirm")}</Text>
                    <Input
                        placeholder={"not 123"}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.input}>
                    </Input>
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                </View>
                <Btn_Fill title={t("Register.section_info.signUpBtn")} onPress={() =>register()} style={styles.saveBtn}/>

                <View style={styles.login}>

                <Text style={styles.text}>{t("Register.section_info.text")}
                    <Text style={styles.link} onPress={() =>navigation.navigate("Login")} >{t("Register.section_info.logInBtn")} </Text>
                </Text>

                </View>

            </View>
        </ScreenWrapper>
    )
}

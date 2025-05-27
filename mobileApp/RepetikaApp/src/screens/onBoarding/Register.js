import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import globalStyles from '../../styles/global';

import styles from '../../styles/Register.style';


import ScreenWrapper from "../../components/navigation/screenWrapper";

import Input from "../../components/frm_input";
import Btn_Fill from "../../components/btn_fill";

/*
export default function RegisterScreen() {
    return (
        <View>
            <Text>Register screen</Text>
        </View>
    )


}
*/
import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';
import Decoration from "../../components/decoration";



export default function RegisterScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();

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
                        onChangeText={() => {}}
                        style={styles.input}>
                    </Input>

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.surname")}</Text>
                    <Input
                        placeholder={"name"}
                        onChangeText={() => {}}
                        style={styles.input}>
                    </Input>

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.mail")}</Text>
                    <Input
                        placeholder={"exemple@gmail.com"}
                        onChangeText={() => {}}
                        style={styles.input}>
                    </Input>

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.password")}</Text>
                    <Input
                        placeholder={"not 123"}
                        onChangeText={() => {}}
                        style={styles.input}>
                    </Input>

                    <Text style={styles.generalInfo_name}>{t("Register.section_info.passwordConfirm")}</Text>
                    <Input
                        placeholder={"not 123"}
                        onChangeText={() => {}}
                        style={styles.input}>
                    </Input>
                </View>
                <Btn_Fill title={t("Register.section_info.signUpBtn")} onPress={() => console.log('cliqué')} style={styles.saveBtn}/>

                <View style={styles.login}>

                <Text style={styles.text}>{t("Register.section_info.text")}
                    <Text style={styles.link} onPress={() =>navigation.navigate("Login")} >{t("Register.section_info.logInBtn")} </Text>
                </Text>

                </View>

            </View>
        </ScreenWrapper>
    )
}

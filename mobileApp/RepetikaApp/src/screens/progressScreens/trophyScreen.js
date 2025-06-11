import {useTranslation} from "react-i18next";
import {Image, Text, View} from "react-native";
import styles from "../../styles/game/endSessionCheck.style";
import globalStyles from "../../styles/global";
import Btn_Fill from "../../components/btn_fill";
import Btn_Empty from "../../components/btn_empty";
import React from "react";

const TrophyView = ({title, description, onPress}) => {
    const {t}=useTranslation();
    return (
        <View style={styles.container}>
            <View style={styles.trophy.textView}>
                <Text style={globalStyles.title}>{t("TropheyPage.CongrateMessage")}</Text>
                <Text style={styles.trophy.trophyName}>{title}</Text>
            </View>
            <View style={styles.trophy.imageView}>
                <Image style={styles.trophy.image} source={require('../../assets/trophy_gold.png')}/>
                <Text style={styles.trophy.description}>{description}</Text>
            </View>
            <View style={styles.trophy.buttonsView}>
                <Btn_Fill title={t("EndSessionCheck.Next")} onPress={onPress} />
                <Btn_Empty title={t("EndSessionCheck.Share")} style={styles.streak.btn.share}/>
            </View>
        </View>
    )
};

export default TrophyView
import { View, Text, TouchableOpacity, ScrollView} from "react-native";

import globalStyles from '../../styles/global';
import colors from '../../styles/colors';
import styles from '../../styles/game/courseIndex.style';

import ScreenWrapper from "../../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import {useState} from "react";




export default function ReviewFrame() {
    const {t}=useTranslation();






    return (
        <ScreenWrapper scrollable>
            <View style={{flex:1}}>


            </View>
        </ScreenWrapper>
    )
}


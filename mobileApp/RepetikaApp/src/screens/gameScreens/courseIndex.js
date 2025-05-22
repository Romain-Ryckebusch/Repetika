import { View, Text, TouchableOpacity, ScrollView} from "react-native";

import globalStyles from '../../styles/global';
import colors from '../../styles/colors';
import styles from '../../styles/game/courseIndex.style';

import ScreenWrapper from "../../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import {useState} from "react";
import Review from "./indexPages/review";



export default function CourseIndex() {
    const {t}=useTranslation();

    const [scopeSelected, setScopeSelected] = useState("Review");


    function switchScopeSelected(newScope) {
        setScopeSelected(newScope);
    }




    return (
        <ScreenWrapper scrollable>
            <View style={{flex:1}}>

                <ScrollView contentContainerStyle={[styles.container,{height:'100%'}]} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                    <View id={"BoxSectionChoices"} style={styles.BoxSectionChoices}>
                        <PlatformPressable style={[styles.boxSectionChoice,scopeSelected==="Cours"?styles.boxScopeSelected:null]} onPress={() => {switchScopeSelected("Cours")}}>
                            <Text style={[styles.boxSectionChoice.text,scopeSelected==="Cours"?styles.boxScopeSelected.text:null]}>{t("courseIndexScreen.coursLabel")}</Text>
                        </PlatformPressable>
                        <PlatformPressable style={[styles.boxSectionChoice,scopeSelected==="Review"?styles.boxScopeSelected:null]} onPress={() => {switchScopeSelected("Review")}}>
                            <Text style={[styles.boxSectionChoice.text,scopeSelected==="Review"?styles.boxScopeSelected.text:null]}>{t("courseIndexScreen.reviewLabel")}</Text>
                        </PlatformPressable>
                    </View>
                    {(scopeSelected==="Review")?(
                        <Review cardsNumber={10}/>
                        ):(<Text>Cours</Text>)
                    }
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}


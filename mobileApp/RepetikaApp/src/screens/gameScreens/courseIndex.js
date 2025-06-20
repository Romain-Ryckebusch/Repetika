import {View, Text, TouchableOpacity, ScrollView, Pressable, Image} from "react-native";

import globalStyles from '../../styles/global';
import colors from '../../styles/colors';
import styles from '../../styles/game/courseIndex.style';

import ScreenWrapper from "../../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import React, {useContext, useState} from "react";
import Review from "./indexPages/review";
import Course from "./indexPages/course";
import backIcon from "../../assets/icons/back.png";
import Progress from "react-native-progress";
import {useNavigation, useRoute} from "@react-navigation/native";
import {CourseContext} from "../../utils/CourseContext";



export default function CourseIndex() {
    const {t}=useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const {currentDeckId,currentCoursId,currentCoursName} = useContext(CourseContext);
    const lessonId= currentCoursId
    const deckId = currentDeckId

    const initialScope = route.params?.initialScope ?? "Review";


    const [scopeSelected, setScopeSelected] = useState(initialScope);


    function switchScopeSelected(newScope) {
        setScopeSelected(newScope);
    }




    return (
        <>
            <View style={styles.header.questionHeaderContainer}>
                <View style={[styles.header.container,{justifyContent:"start"},{height: 60},{alignItems:"flex-end"}]}>
                    <Pressable style={[styles.header.backArrowBtn]} onPress={() =>navigation.navigate('MainApp', {
                        screen: 'Home'
                    })}>
                        <Image style={styles.header.backArrowImg} source={backIcon}></Image>
                    </Pressable>
                    <Text style={[styles.header.headerTitle,{paddingBottom:2}]}>{currentCoursName}</Text>
                </View>
            </View>

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
                            <Review lessonId={lessonId} deckId={deckId}/>
                            ):(<Course courseId={lessonId} deckId={deckId}/>)
                        }
                    </ScrollView>
                </View>
            </ScreenWrapper>
        </>
    )
}


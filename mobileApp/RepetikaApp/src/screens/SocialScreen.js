import { View, Text, TouchableOpacity, ScrollView} from "react-native";

import globalStyles from '../styles/global';
import colors from '../styles/colors';
import styles from '../styles/SocialScreen.style';

import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import {useState} from "react";
import Badge from "../components/badge";
import RankedUserLine from "../components/rankedUserLine";



export default function SocialScreen() {
    const {t}=useTranslation();

    const [scopeSelected, setScopeSelected] = useState("Global");
    const [filterSelected,setFilterSelected] = useState("study");

    const users = [
        {
            id:1,
            ProfilePicture: require("../assets/Profile.png"),
            Name: "Franck",
            Strikes: 200,
            progress: 0.74,
            level: 67,
            totalXp: 13450,
            studiedCardsToday: 14,
            activeCards: 123
        },
        {
            id:2,
            ProfilePicture: require("../assets/Profile.png"),
            Name: "Alice",
            Strikes: 150,
            progress: 0.62,
            level: 58,
            totalXp: 11200,
            studiedCardsToday: 10,
            activeCards: 98
        },
        {
            id:3,
            ProfilePicture: require("../assets/Profile.png"),
            Name: "Liam",
            Strikes: 230,
            progress: 0.89,
            level: 72,
            totalXp: 14800,
            studiedCardsToday: 20,
            activeCards: 135
        },
        {
            id:4,
            ProfilePicture: require("../assets/Profile.png"),
            Name: "Sofia",
            Strikes: 180,
            progress: 0.53,
            level: 49,
            totalXp: 9800,
            studiedCardsToday: 8,
            activeCards: 87
        },
        {
            id:5,
            ProfilePicture: require("../assets/Profile.png"),
            Name: "Noah",
            Strikes: 95,
            progress: 0.34,
            level: 32,
            totalXp: 6400,
            studiedCardsToday: 5,
            activeCards: 60
        }
    ];


    function switchScopeSelected(newScope) {
        setScopeSelected(newScope);
    }

    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                   <Text style={globalStyles.title}>Social</Text>
                    <Text style={globalStyles.subtitle}>Classement</Text>
                    <View id={"BoxScopeChoices"} style={styles.BoxScopeChoices}>
                        <PlatformPressable style={[styles.boxScopeChoice,scopeSelected==="Global"?styles.boxScopeSelected:null]} onPress={() => {switchScopeSelected("Global")}}>
                            <Text style={[styles.boxScopeChoice.text,scopeSelected==="Global"?styles.boxScopeSelected.text:null]}>Global</Text>
                        </PlatformPressable>
                        <PlatformPressable style={[styles.boxScopeChoice,scopeSelected==="Friend"?styles.boxScopeSelected:null]} onPress={() => {switchScopeSelected("Friend")}}>
                            <Text style={[styles.boxScopeChoice.text,scopeSelected==="Friend"?styles.boxScopeSelected.text:null]}>Amis</Text>
                        </PlatformPressable>
                    </View>
                    <View style={styles.filtersView}>
                        <Badge id={"study"} title={"Cartes étudiées"} selected={filterSelected === "study"}/>
                        <Badge id={"xp"} title={"XP"} selected={filterSelected === "xp"} />
                        <Badge id={"strique"} title={"Strique"} selected={filterSelected === "strique"} />
                        <Badge id={"actives"} title={"Cartes actives"} selected={filterSelected === "actives"}/>
                    </View>

                    <View id={"Classement"}>
                        <RankedUserLine progress={0.5} level={63} rank={1} name={"Bob"} picture={require("../assets/Profile.png")} streaks={53}/>
                    </View>


                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}


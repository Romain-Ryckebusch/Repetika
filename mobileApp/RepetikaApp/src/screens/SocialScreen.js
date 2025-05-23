import { View, Text, TouchableOpacity, ScrollView} from "react-native";

import globalStyles from '../styles/global';
import Decoration from "../components/decoration";
import styles from '../styles/SocialScreen.style';

import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";
import {PlatformPressable} from "@react-navigation/elements";
import {useState} from "react";
import Badge from "../components/badge";
import RankedUserLine from "../components/rankedUserLine";

import CustomModal from "../components/customModal";
import Btn_Fill from "../components/btn_fill"; 
import Input from "../components/frm_input";
import AddFriendBadge from "../components/addFriendBadge";


export default function SocialScreen() {
    const {t}=useTranslation();

    const [scopeSelected, setScopeSelected] = useState("Global");
    const [filterSelected,setFilterSelected] = useState("study");
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    const UserId = 3
    const GlobalUsers = [
        {
            id:1,
            profilePicture: require("../assets/Profile.png"),
            name: "Franck",
            streak: 200,
            progress: 0.74,
            level: 67,
            totalXp: 13450,
            studiedCardsToday: 14,
            activeCards: 123
        },
        {
            id:2,
            profilePicture: require("../assets/Profile.png"),
            name: "Alice",
            streak: 150,
            progress: 0.62,
            level: 58,
            totalXp: 11200,
            studiedCardsToday: 10,
            activeCards: 98
        },
        {
            id:3,
            profilePicture: require("../assets/Profile.png"),
            name: "Aymeric",
            streak: 190,
            progress: 0.89,
            level: 72,
            totalXp: 14800,
            studiedCardsToday: 2,
            activeCards: 135
        },
        {
            id:4,
            profilePicture: require("../assets/Profile.png"),
            name: "Sofia",
            streak: 180,
            progress: 0.53,
            level: 49,
            totalXp: 9800,
            studiedCardsToday: 8,
            activeCards: 87
        },
        {
            id:5,
            profilePicture: require("../assets/Profile.png"),
            name: "Noah",
            streak: 95,
            progress: 0.34,
            level: 32,
            totalXp: 6400,
            studiedCardsToday: 5,
            activeCards: 60
        }
    ];

    const FriendUsers =[
        {
            id:1,
            profilePicture: require("../assets/Profile.png"),
            name: "Franck",
            streak: 200,
            progress: 0.74,
            level: 67,
            totalXp: 13450,
            studiedCardsToday: 14,
            activeCards: 123
        },
        {
        id:2,
        profilePicture: require("../assets/Profile.png"),
        name: "Alice",
        streak: 150,
        progress: 0.62,
        level: 58,
        totalXp: 11200,
        studiedCardsToday: 10,
        activeCards: 98
},
    {
        id:3,
        profilePicture: require("../assets/Profile.png"),
        name: "Aymeric",
        streak: 190,
        progress: 0.89,
        level: 72,
        totalXp: 14800,
        studiedCardsToday: 2,
        activeCards: 135
    }]

    function switchScopeSelected(newScope) {
        setScopeSelected(newScope);
    }
    function switchFilterSelected(newFilter) {
        setFilterSelected(newFilter);
    }

    const scopeToUsersMap={
        "Global":GlobalUsers,
        "Friend":FriendUsers
    }

    function sortUsersByKey(userList,filter, descending = true) {
        const filterToFiledMap={
            "xp":"totalXp",
            "study":"studiedCardsToday",
            "streak":"streak",
            "actives":"activeCards"
        }

        const key = filterToFiledMap[filter];

        return [...userList].sort((a, b) => {
            if (typeof a[key] === "string") {
                return descending
                    ? b[key].localeCompare(a[key])
                    : a[key].localeCompare(b[key]);
            }
            return descending ? b[key] - a[key] : a[key] - b[key];
        });
    }

    return (
        <View>
        
        <Decoration radius={900} top={0} left={-600} opacity={0.06} />

        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                   <Text style={globalStyles.title}>{t('socialScreen.title')}</Text>
                    <Text style={globalStyles.subtitle}>{t('socialScreen.subTitle')}</Text>
                    <View id={"BoxScopeChoices"} style={styles.BoxScopeChoices}>
                        <PlatformPressable style={[styles.boxScopeChoice,scopeSelected==="Global"?styles.boxScopeSelected:null]} onPress={() => {switchScopeSelected("Global")}}>
                            <Text style={[styles.boxScopeChoice.text,scopeSelected==="Global"?styles.boxScopeSelected.text:null]}>{t("socialScreen.globalLabel")}</Text>
                        </PlatformPressable>
                        <PlatformPressable style={[styles.boxScopeChoice,scopeSelected==="Friend"?styles.boxScopeSelected:null]} onPress={() => {switchScopeSelected("Friend")}}>
                            <Text style={[styles.boxScopeChoice.text,scopeSelected==="Friend"?styles.boxScopeSelected.text:null]}>{t("socialScreen.friendsLabel")}</Text>
                        </PlatformPressable>
                    </View>
                    <View style={styles.filtersView}>
                        <Badge id={"study"} title={t("socialScreen.studiedCardsLabel")} selected={filterSelected === "study"} onPress={()=>switchFilterSelected("study")}/>
                        <Badge id={"xp"} title={t("socialScreen.xpLabel")} selected={filterSelected === "xp"} onPress={()=>switchFilterSelected("xp")} />
                        <Badge id={"streak"} title={t("socialScreen.streakLabel")} selected={filterSelected === "streak"} onPress={()=>switchFilterSelected("streak")} />
                        <Badge id={"actives"} title={t("socialScreen.activesCardsLabel")} selected={filterSelected === "actives"} onPress={()=>switchFilterSelected("actives")}/>
                    </View>

                    <View id={"Classement"} style={styles.classementView}>
                        {
                            sortUsersByKey(scopeToUsersMap[scopeSelected],filterSelected,true).map((user,index) => (
                                <RankedUserLine key={user.id} progress={user.progress} level={user.level} rank={index+1} name={user.name} picture={user.profilePicture} streaks={user.streak} studiedCards={user.studiedCardsToday} itsme={user.id===UserId}/>
                                ))
                        }
                        <Btn_Fill title={t("socialScreen.addFriend")} onPress={() => setAddFriendModalVisible(true)} style={{marginTop:16}}/>
     
                    </View>


                </ScrollView>

                <CustomModal styles={styles.modal} visible={addFriendModalVisible} onClose={() => setAddFriendModalVisible(false)}>
                    <Text style={styles.modalTitle}>{t("socialScreen.addFriend")}</Text>

                    <Text style={styles.modalSearchLabel}>{t("socialScreen.addFriendLabel")}</Text>
                    <Input
                        placeholder={t("socialScreen.addFriendPlaceholder")}
                        onChangeText={() => {}}
                        secureTextEntry={false}
                        style={{marginTop:16}}
                    />
                    <ScrollView style={{marginTop:16, maxHeight: 200}} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                        <TouchableOpacity activeOpacity={1}>                      
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                            <AddFriendBadge onPress={() => {}}/>
                        </TouchableOpacity>
                    </ScrollView>

                    <Btn_Fill title={t("socialScreen.addFriend")} onPress={() => setAddFriendModalVisible(true)} style={styles.closeBtn}/>

                </CustomModal>

            </View>
        </ScreenWrapper>
        </View>
    )
}

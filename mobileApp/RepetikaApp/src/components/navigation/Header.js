import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import globalStyles from "../../styles/global";
import * as Progress from 'react-native-progress';
import styles from '../../styles/navigation/TopBar.style';
import { navigate, getCurrentRoute } from '../../navigation/NavigationService';
import settingsIcon from "../../assets/icons/settings.png";
import {useNavigation, useRoute} from "@react-navigation/native";
import * as XPF from "../../utils/ProgressFunctions"
import backIcon from "../../assets/icons/back.png";



const DefaultHeader = ({ xp, streakDays, profilePicture }) => {
    const streakIcon = require('../../assets/icons/streakIcon.png');
    const settingsIcon = require('../../assets/icons/settings.png');
    const backIcon = require('../../assets/icons/back.png');
    const navigation = useNavigation();
    const route = useRoute();
    const currentRoute = getCurrentRoute();
    const routeName = currentRoute?.name ?? null;

    const xpData = XPF.XpAllDataFunction(xp)
    const progress = xpData.progress;
    const lvl = xpData.level

    if (routeName === "Home" || routeName ==="Social" || routeName === "Stats") {
        return (
            <View style={styles.container}>
                <View style={styles.levelSection}>
                    <Progress.Bar
                        style={[globalStyles.card_progressbar, styles.progressBar]}
                        height={16}
                        color="#F1C40F"
                        unfilledColor="#d9d9d9"
                        borderWidth={0}
                        progress={progress}
                    />
                    <View style={styles.circle}>
                        <Text>{lvl}</Text>
                    </View>
                </View>
                <View style={styles.streakSection}>
                    <Text style={styles.streakText}>{streakDays}</Text>
                    <Image style={styles.streakIcon} source={streakIcon}></Image>
                </View>
                <Pressable style={styles.profilePictureButton} onPress={() => navigate('Profile')}>
                    <Image style={styles.profilePictureImage} source={profilePicture}></Image>
                </Pressable>
            </View>
        );
    }
    if(routeName==="Profile") {
        return (
            <View style={styles.container}>
                <Pressable style={styles.profilePictureButton} onPress={() => navigate('settingsScreen')}>
                    <Image style={styles.profilePictureImage} source={settingsIcon}></Image>
                </Pressable>
            </View>
        );
    }
    if (routeName==="settingsScreen") {
        return (
            <View style={styles.container}>
                <Pressable style={styles.profilePictureButton} onPress={() =>navigation.goBack()}>
                    <Image style={styles.profilePictureImage} source={backIcon}></Image>
                </Pressable>
            </View>
        );
    }
    if(routeName==="ReviewFrame"){
        return (
            <></>
        )
    }
    if(routeName==="CourseIndex"){
        return (
            <View style={[styles.container,{justifyContent:"start"}]}>
                <Pressable style={styles.backArrowBtn} onPress={() =>navigate("MainApp")}>
                    <Image style={styles.backArrowImg} source={backIcon}></Image>
                </Pressable>
                <Text style={styles.headerTitle}>Pays du monde</Text>

            </View>
        );
    }
    else{
        return (
            <View style={[styles.container,{justifyContent:"start"}]}>
                <Pressable style={styles.backArrowBtn} onPress={() =>navigation.goBack()}>
                    <Image style={styles.backArrowImg} source={backIcon}></Image>
                </Pressable>
                <Text style={styles.headerTitle}>Pays du monde</Text>

            </View>
        );
    }

};

export default DefaultHeader;

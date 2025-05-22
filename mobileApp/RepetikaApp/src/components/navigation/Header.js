import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import globalStyles from "../../styles/global";
import * as Progress from 'react-native-progress';
import styles from '../../styles/navigation/TopBar.style';
import { navigate, getCurrentRoute } from '../../navigation/NavigationService';

const DefaultHeader = ({ progress, lvl, streakDays, profilePicture }) => {
    const streakIcon = require('../../assets/icons/streakIcon.png');
    const settingsIcon = require('../../assets/icons/settings.png');

    const currentRoute = getCurrentRoute();
    const routeName = currentRoute?.name ?? null;

    if (routeName !== "Profile") {
        return (
            <View style={styles.container}>
                <View style={styles.levelSection}>
                    <Progress.Bar
                        style={[globalStyles.card_progressbar, styles.progressBar]}
                        height={16}
                        color="#F1C40F"
                        unfilledColor="#d9d9d9"
                        borderWidth={0}
                        progress={progress / 100}
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
    } else {
        return (
            <View style={styles.container}>
                <Pressable style={styles.profilePictureButton} onPress={() => navigate('Profile')}>
                    <Image style={styles.profilePictureImage} source={settingsIcon}></Image>
                </Pressable>
            </View>
        );
    }
};

export default DefaultHeader;

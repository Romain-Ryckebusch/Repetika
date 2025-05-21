import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';
import {ICON_MARGIN} from "@react-navigation/elements/src/Header/HeaderIcon";
import globalStyles from "../styles/global";
import * as Progress from 'react-native-progress';


const RankedUserLine = ({ rank,picture,name,streaks,progress,level }) => {
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.rankText}>{rank}</Text>
            <Image style={styles.profilePicture} source={picture} />
            <View>
                <Text>{name}</Text>
                <View>
                    <Text>{streaks}</Text>
                    <Image source={require("../assets/streakIcon.png")} style={styles.streaksPicture}></Image>
                </View>
            </View>
            <Progress.Bar
                style={[globalStyles.card_progressbar]}
                height={16}
                color="#F1C40F"
                unfilledColor="#d9d9d9"
                borderWidth={0}
                progress={progress}
            />
            <View style={styles.circle}>
                <Text>{level}</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        width: '100%',
        backgroundColor:colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10, // moitié de width/height
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText:{
        fontSize: 24,
    },
    profilePicture:{
        width:42,
        height:42
    },
    streaksPicture:{
        width:25,
        height:25,
    }
});

export default RankedUserLine;

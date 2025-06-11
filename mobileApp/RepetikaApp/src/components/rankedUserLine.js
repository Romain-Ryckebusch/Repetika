import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image, Pressable} from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';
import globalStyles from "../styles/global";
import * as Progress from 'react-native-progress';
import * as XPF from "../utils/ProgressFunctions";


const RankedUserLine = ({ rank,picture,name,streaks,xp,studiedCards, itsme, onPress }) => {
    const fontsLoaded = useGlobalFonts();

    const xpData = XPF.XpAllDataFunction(xp)
    const progress = xpData.progress;
    const level = xpData.level

    if (!fontsLoaded) return null;

    return (
        <Pressable style={[styles.container, itsme?styles.myCard:null]} onPress={onPress}>
            <Text style={styles.rankText}>{rank}</Text>
            <Image style={styles.profilePicture} source={picture} />
            <View style={styles.nameView}>
                <Text style={styles.nameView.name}>{name}</Text>
                <View style={styles.nameView.streakView}>
                    <Text style={styles.nameView.streakView.text}>{streaks}</Text>
                    <Image source={require("../assets/icons/streakIcon.png")} style={styles.nameView.streakView.streaksPicture}></Image>
                </View>
            </View>

            <View>
                <Progress.Bar
                    style={[globalStyles.card_progressbar]}
                    height={16}
                    color="#F1C40F"
                    unfilledColor="#d9d9d9"
                    borderWidth={0}
                    progress={progress}
                    width={70}
                />
            </View>
            <View style={styles.circle}>
                <Text style={styles.circle.text}>{level}</Text>
            </View>
            <Image source={require("../assets/icons/cards.png")} style={styles.cardIcon} />
            <Text style={styles.cardText}>{studiedCards}</Text>

        </Pressable>
    );
};

const styles = StyleSheet.create({
    myCard:{
        backgroundColor:colors.orange
    },
    container:{
        width: '100%',
        backgroundColor:colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius:8,
        padding:8,
        marginVertical:8
    },
    rankText:{
        fontSize: 24,
        color:colors.white,
        fontFamily:"OpenSans_Bold",
        width:'5%'
    },
    profilePicture:{
        width:42,
        height:42
    },
    nameView:{
        width:'25%',
        name:{
            fontSize: 16,
            color:colors.white,
            fontFamily: 'KronaOne_Regular',
        },
        streakView:{
            flexDirection:'row',
            alignItems: 'center',
            text:{
                fontSize: 16,
                fontFamily:'OpenSans_Bold',
                color:colors.white,
            },
            streaksPicture:{
                width:25,
                height:25,
            }
        }
    },
    cardIcon:{
        width:32,
        height:32
    },
    cardText:{
        color:colors.white,
        fontSize:16,
        fontFamily:'OpenSans_Bold',
    },
    circle: {
        width: 25,
        height: 25,
        borderRadius: 12.5, // moitié de width/height
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        text:{
            fontSize:16,
            color:colors.white
        }
    }
});

export default RankedUserLine;

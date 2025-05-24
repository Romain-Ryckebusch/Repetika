import {View, Text, TouchableOpacity, ScrollView,StyleSheet,Dimensions, FlatList} from "react-native";

import globalStyles from '../../../styles/global';
import styles from '../../../styles/game/courseIndex.style';


import {useTranslation} from "react-i18next";



const course=[
    {
        "id":1,
        "title":"Introduction",
        "isSrarted":true,
        "isFinished":true,
        "isAvailable":true,
    },
    {
        "id":2,
        "title":"L'art de la diplomatie",
        "isSrarted":true,
        "isFinished":false,
        "isAvailable":true,
    },
    {
        "id":3,
        "title":"L'art de la guerre",
        "isSrarted":false,
        "isFinished":false,
        "isAvailable":false,
    },
    {
        "id":4,
        "title":"L'homme préhistorique",
        "isSrarted":false,
        "isFinished":false,
        "isAvailable":false,
    }
]

export default function Course (){

    const leftChapters = course.filter((_, index) => index % 2 === 0);
    const rightChapters = course.filter((_, index) => index % 2 === 1);

    const screenWidth = Dimensions.get('window').width;
    const widthCircle = screenWidth *1*0.3; // 80% d'un tiers de la largeur écran

    return (
        <View style={styles.coursePage.view}>
            <View style={[styles.coursePage.view.sideColumn,{alignItems:"flex-end"}]}>
                {leftChapters.map(chapter => (
                    <View key={chapter.id} style={[styles.coursePage.chapterView,{width:widthCircle,height:widthCircle,borderRadius:0.5*widthCircle,marginBottom:widthCircle}]}><Text style={styles.coursePage.chapterView.title}>{chapter.title}</Text></View>
                ))}
            </View>
            <View id={"centerColumn"} style={[styles.coursePage.view.centerColumn,{height:3*widthCircle,marginTop:0.5*widthCircle}]}>
                <View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: '45deg' }],width:Math.sqrt(2)*widthCircle}]} />
                <View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: '-45deg' }],width:Math.sqrt(2)*widthCircle}]} />
                <View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: '45deg' }],width:Math.sqrt(2)*widthCircle}]} />
            </View>
            <View>
                {rightChapters.map(chapter => (
                    <View key={chapter.id} style={[styles.coursePage.chapterView,{width:widthCircle,height:widthCircle,borderRadius:0.5*widthCircle,marginTop:widthCircle}]}><Text style={styles.coursePage.chapterView.title}>{chapter.title}</Text></View>
                ))}
            </View>
        </View>

    );
};






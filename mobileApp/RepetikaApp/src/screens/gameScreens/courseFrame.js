import React from 'react';
import { View, StyleSheet,Pressable,Image,Text } from 'react-native';
import { WebView } from 'react-native-webview';
import backIcon from "../../assets/icons/back.png";
import {navigate} from "../../navigation/NavigationService";

export default function CourseFrame() {
    const pdfUrl = "https://aymeric-droulers.github.io/ISEN3_24-25_Lancement-PFA3.pdf"
    const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=`+pdfUrl;

    return (
        <>
            <View style={styles.header.questionHeaderContainer}>
                <View style={[styles.header.container,{justifyContent:"start"},{height: 60},{alignItems:"flex-end"}]}>
                    <Pressable style={[styles.header.backArrowBtn]} onPress={() =>navigate("CourseIndex")}>
                        <Image style={styles.header.backArrowImg} source={backIcon}></Image>
                    </Pressable>
                    <Text style={[styles.header.headerTitle,{paddingBottom:2}]}>Pays du monde</Text>
                </View>
            </View>
            <View style={styles.container}>
                <WebView
                    source={{ uri: viewerUrl}}
                    style={{ flex: 1 }}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        container: {
            height: '10%',
            paddingHorizontal: 16,
            marginTop:16,
            marginBottom:16,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        headerTitle: {
            fontSize: 16,
            fontFamily: 'KronaOne_Regular'
        },
        backArrowBtn: {
            marginRight: 8
        },
        backArrowImg: {
            width: 24,
            height: 24
        },
        questionHeaderContainer: {
            width: '100%',
        },
        progressBar:{
            alignSelf:"center",
        },
    },
});

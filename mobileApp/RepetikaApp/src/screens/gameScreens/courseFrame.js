import React, {useContext} from 'react';
import { View, StyleSheet,Pressable,Image,Text } from 'react-native';
import { WebView } from 'react-native-webview';
import backIcon from "../../assets/icons/back.png";
import {navigate} from "../../navigation/NavigationService";
import Btn_Fill from "../../components/btn_fill";
import {useRoute} from "@react-navigation/native";
import useFetch from "../../utils/useFetch";
import {AuthContext} from "../../utils/AuthContext";
import Config from "../../config/config";

export default function CourseFrame() {
    const { userId } = useContext(AuthContext); // <- une seule fois
    console.log(userId);
    const pdfUrl = "https://aymeric-droulers.github.io/ISEN3_24-25_Lancement-PFA3.pdf"
    const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=`+pdfUrl;
    const route = useRoute();

    const finishChapter = async () => {
        const idChapitre = route.params?.chapterId;
        const idDeck = route.params?.deckId;

        const url = Config.BASE_URL+`/main/completeQuiz?user_id=${userId}&id_chapitre=${idChapitre}&id_deck=${idDeck}`;
        console.log(url);

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Réponse :', data);
        } catch (error) {
            console.error('Erreur lors de la complétion du chapitre :', error);
        }
    }



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
                <Btn_Fill style={{marginBottom:'10%',width:'80%',marginLeft:'10%',marginTop:'5%'}} title={"Terminer le chapitre"} onPress={()=>finishChapter()}/>
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

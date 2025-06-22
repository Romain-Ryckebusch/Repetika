import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Image, Text, ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';
import backIcon from "../../assets/icons/back.png";
import {navigate} from "../../navigation/NavigationService";
import Btn_Fill from "../../components/btn_fill";
import {useRoute} from "@react-navigation/native";
import useFetch from "../../utils/useFetch";
import {AuthContext} from "../../utils/AuthContext";
import Config from "../../config/config";
import colors from "../../styles/colors";
import {CourseContext} from "../../utils/CourseContext";

export default function CourseFrame() {
    const { userId } = useContext(AuthContext);
    const {currentCoursId,currentCoursName}= useContext(CourseContext)
    const pdfUrl = Config.BASE_URL+`/main/getPDF?user_id=${userId}&id_course=${currentCoursId}`;
    const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    const route = useRoute();

    const[loading,setLoading]=useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);


    const finishChapter = async () => {
        setLoading(true);
        const idChapitre = route.params?.chapterId;
        const idDeck = route.params?.deckId;

        const url = Config.BASE_URL + `/main/completeQuiz?user_id=${userId}&id_chapitre=${idChapitre}&id_deck=${idDeck}`;
        console.log(url);

        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            navigate("CourseIndex",{
                initialScope:"Cours"
            })
        } catch (error) {
            console.error('Erreur lors de la complétion du chapitre :', error);
        } finally {
            setLoading(false);

        }
    };




    return (
        <>
            <View style={styles.header.questionHeaderContainer}>
                <View style={[styles.header.container,{justifyContent:"start"},{height: 60},{alignItems:"flex-end"}]}>
                    <Pressable style={[styles.header.backArrowBtn]} onPress={() =>navigate("CourseIndex",{
                        initialScope:"Cours"
                    })}>
                        <Image style={styles.header.backArrowImg} source={backIcon}></Image>
                    </Pressable>
                    <Text style={[styles.header.headerTitle,{paddingBottom:2}]}>{currentCoursName}</Text>
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <View style={styles.container}>
                    {!pdfLoaded && (
                        <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(255,255,255,0.7)',zIndex:10,justifyContent:'center',alignItems:'center'}}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{marginTop:10}}>Chargement du PDF...</Text>
                        </View>
                    )}
                    <WebView
                        source={{ uri: googleViewerUrl }}
                        style={{ flex: 1 }}
                        onLoadEnd={() => setPdfLoaded(true)}
                        onLoadStart={() => setPdfLoaded(false)}
                    />
                    <Btn_Fill style={{marginBottom:'10%',width:'80%',marginLeft:'10%',marginTop:'5%'}} title={"Terminer le chapitre"} onPress={()=>finishChapter()}/>
                </View>
            )}
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

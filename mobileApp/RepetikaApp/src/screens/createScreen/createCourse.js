import {View, Text, Pressable, Image, TouchableOpacity, Alert} from "react-native";
import Input from "../../components/frm_input";
import styles from "../../styles/createCourse/createCourse.style"
import globalStyles from "../../styles/global";
import React, {useContext, useState} from "react";
import Btn_Fill from "../../components/btn_fill";
import ScreenWrapper from "../../components/navigation/screenWrapper";
import {navigate} from "../../navigation/NavigationService";
import colors from "../../styles/colors";
import {PlatformPressable} from "@react-navigation/elements";
import {useNavigation} from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';
import {CreateCourseContext} from "../../utils/CreateCourseContext";
import Config from "../../config/config";
import config from "../../config/config";
import {saveSession} from "../../utils/session";
import {useTranslation} from "react-i18next";


const ChapterBox = ({id,name,onUp,onDown})=>{
    const {t}=useTranslation();

    return(
        <View style={styles.chapterBox}>
            <View style={styles.chapterBox.leftBox}>
                <Text style={styles.chapterBox.leftBox.title}>{name}</Text>
                <Btn_Fill title={t("CreateCoursePage.edit")} style={styles.chapterBox.leftBox.btn} onPress={()=>editChapter(id)}/>
            </View>
            <View style={styles.chapterBox.rightBox}>
                <Pressable style={styles.chapterBox.rightBox.btn} onPress={()=>{onUp()}}>
                    <Image style={styles.chapterBox.rightBox.img} source={require("../../assets/icons/upArrow.png")}></Image>
                </Pressable>
                <Pressable style={styles.chapterBox.rightBox.btn} onPress={()=>{onDown()}}>
                    <Image style={styles.chapterBox.rightBox.img} source={require("../../assets/icons/downArrow.png")}></Image>
                </Pressable>
            </View>

            <View></View>
        </View>
    )
}





function createNewChapter(){
    navigate("CreateChapterScreen")
}

function editChapter(id){
    navigate("CreateChapterScreen",{
        chapterId: id,
    })
}




const CreateCourseScreen =  () => {
    const navigation = useNavigation();
    const {t}=useTranslation();
    const {chapterList,setChapterList,cardsListByChapter,setCardsListByChapter, courseTitle, setCourseTitle, courseDescription, setCourseDescription, pdfFile, setPdfFile} = useContext(CreateCourseContext);
    const [loading, setLoading] = useState(false); // Ajout de l'état de chargement

    const getPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });
            if (result.canceled === false) {
                setPdfFile(result); // Sauvegarde le fichier sélectionné
            } else {
                console.log('Sélection annulée');
            }
        } catch (err) {
            console.error('Erreur sélection PDF:', err);
            Alert.alert('Erreur', t("CreateCoursePage.PdfSelectError"));
        }
    };


    function saveCourse(){
        setLoading(true); // Début du chargement
        postData().then(async r => {
            if (r !== false) {
                const deckId = r.id_deck;
                const chaptersIdsList = r.id_chapitres
                const coursId = r.id_cours;
                let finalList = []
                let i =0;
                cardsListByChapter.map(chapterCards => {
                    const cardsList = chapterCards.cards;
                    cardsList.forEach(card => {
                        finalList.push({
                            id_deck:deckId,
                            id_chapitre:chaptersIdsList[i],
                            front:card.recto,
                            back:card.verso,
                        });
                    })
                    i++;
                })
                try {
                    const response = await fetch(config.BASE_URL + '/main/createCards', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "cartes":finalList
                        })
                    });
                    const data = await response.json();
                    if (data.error) {
                        console.error(data.error);
                        alert(data.error)
                        setLoading(false);
                        navigation.navigate("MainApp", { screen: "Home" });
                    } else {
                        setLoading(false);
                        Alert.alert("Succès", t("CreateCoursePage.SendSuccess"));
                        navigation.navigate("MainApp", { screen: "Home" }); // Redirection si succès
                    }
                } catch (err) {
                    console.log(err.message);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        })
    }



    const postData = async () => {
        if (!pdfFile) {
            Alert.alert("Erreur", t("CreateCoursePage.PdfNotSelected"));
            return;
        }

        const formData = new FormData();
        const file = pdfFile.assets[0];
        formData.append('pdf', {
            uri: file.uri,
            name: file.name || 'document.pdf',
            type: file.mimeType || 'application/pdf',
        });


        const metadata = {
            course_name: courseTitle || "Cours sans titre",
            chapters: chapterList.map(chap => [chap.title, 1]), // Remplace 1 par la vraie durée
            user_id: '68386a41ac5083de66afd675',
            public: false,
        };

        formData.append('metadata', JSON.stringify(metadata));
        try {
            const response = await fetch(Config.BASE_URL+"/main/ajout-cours", {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {

                return(data)
            } else {
                console.error("Erreur serveur:", data);
                Alert.alert("Erreur", t("CreateCoursePage.SendError"));
                return false
            }

        } catch (err) {
            console.error("Erreur réseau:", err);
            Alert.alert("Erreur", t("CreateCoursePage.ServerError"));
            return false
        }
    };







    const moveItem = (fromIndex, change) => {

        if(fromIndex+change >=0 && fromIndex+change <= chapterList.length-1) {
            setChapterList(prevItems => {
                const updatedItems = [...prevItems];
                const [movedItem] = updatedItems.splice(fromIndex, 1);
                updatedItems.splice(fromIndex + change, 0, movedItem);
                return updatedItems;
            });

            setCardsListByChapter(prevItems => {
                const updatedItems = [...prevItems];
                const [movedItem]=updatedItems.splice(fromIndex, 1);
                updatedItems.splice(fromIndex + change, 0, movedItem);
                return updatedItems;
            })

        }else{

        }
    };


    const confirmerAction = () => {
        Alert.alert(
            t("CreateCoursePage.BackTitle"),
            t("CreateCoursePage.BackContent"),
            [
                {
                    text: t("CreateCoursePage.BackCancel"),
                    style: "cancel"
                },
                {
                    text: t("CreateCoursePage.BackConfirm"),
                    onPress: () => {
                        navigation.navigate("ChooseCourses");
                    }
                }
            ],
            { cancelable: false }
        );
    };




    return(
        <View style={styles.container}>
            {/* Affichage du loader si loading est true */}
            {loading && (
                <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(255,255,255,0.7)',zIndex:10,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20}}>{t('CreateCoursePage.Loading')}</Text>
                </View>
            )}
            <PlatformPressable onPress={()=>{confirmerAction()}}>
                <Image style={styles.backArrow} source={require("../../assets/icons/back.png")}></Image>
            </PlatformPressable>
            <Text style={globalStyles.title}>{t("CreateCoursePage.Title")}</Text>
            <View>
                <Text style={styles.subtitle}>{t("CreateCoursePage.SubtitleInfo")}</Text>
                <Text style={styles.inputContainer}>{t("CreateCoursePage.NameCourseLabel")}</Text>
                <Input maxLength={64} value={courseTitle} onChangeText={setCourseTitle} />
                <Text style={styles.inputContainer}>{t("CreateCoursePage.DescCourseLabel")}</Text>
                <Input maxLength={256} value={courseDescription} onChangeText={setCourseDescription} multiline={true} numberOfLines={4} />
                <Text style={styles.inputContainer}>{pdfFile?pdfFile.assets[0].name:""}</Text>
                <TouchableOpacity style={styles.editPictureBtn} onPress={() => getPdf()}>
                    <Text style={styles.editPictureBtnText}>{pdfFile?t("CreateCoursePage.EditPdfLabel"):t("CreateCoursePage.AddPdfLabel")}</Text>
                </TouchableOpacity>
                {/* <Text style={styles.inputContainer}>Tags</Text>
                <Text style={[styles.inputContainer,{fontStyle:'italic'}]}>Coming sooon</Text>*/}
            </View>
            <Text style={styles.subtitle}>{t("CreateCoursePage.SubtitleChapters")}</Text>
            <ScreenWrapper scrollable style={styles.chapterList}>
                {chapterList.map((item,index)=>{
                    return(
                        <ChapterBox key={item.id} id={item.id} name={item.title} onUp={()=>{moveItem(index,-1)}} onDown={()=>{moveItem(index,1)}}/>
                    )
                })}



                <TouchableOpacity style={styles.addChapter} onPress={()=>createNewChapter()}>
                    <Text style={{fontSize: 32, color:colors.grey}}>+</Text>
                </TouchableOpacity>
            </ScreenWrapper>

            <View style={styles.btnView}>
                <Btn_Fill title={t("CreateCoursePage.Save")} onPress={()=>saveCourse()}/>
                <Btn_Fill title={t("CreateCoursePage.Delete")}/>
            </View>
        </View>
    )
}


export default CreateCourseScreen;
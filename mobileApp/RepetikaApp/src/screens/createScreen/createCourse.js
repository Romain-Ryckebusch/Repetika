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


const ChapterBox = ({id,name,onUp,onDown})=>{

    return(
        <View style={styles.chapterBox}>
            <View style={styles.chapterBox.leftBox}>
                <Text style={styles.chapterBox.leftBox.title}>{name}</Text>
                <Btn_Fill title={"Modifier"} style={styles.chapterBox.leftBox.btn} onPress={()=>editChapter(id)}/>
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


function saveCourse(){

}



function createNewChapter(){
    console.log("Create New Chapter");
    navigate("CreateChapterScreen")
}

function editChapter(id){
    navigate("CreateChapterScreen",{
        chapterId: id,
    })
}




const CreateCourseScreen =  () => {
    const navigation = useNavigation();

    const [courseTitle,setCourseTitle] = useState("");
    const [courseDescription,setCourseDescription] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const {chapterList,setChapterList} = useContext(CreateCourseContext)

    const getPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });
            if (result.canceled === false) {
                console.log('PDF sélectionné :', result);
                setPdfFile(result); // Sauvegarde le fichier sélectionné
            } else {
                console.log('Sélection annulée');
            }
        } catch (err) {
            console.error('Erreur sélection PDF:', err);
            Alert.alert('Erreur', 'Impossible de sélectionner un fichier PDF.');
        }
    };


    const postData = async () => {
        if (!pdfFile) {
            Alert.alert("Erreur", "Veuillez sélectionner un fichier PDF.");
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
        console.log(formData)
        try {
            const response = await fetch(Config.BASE_URL+"/main/ajout-cours", {
                method: 'POST',
                body: formData,
                // ❌ NE PAS ajouter Content-Type à la main
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Succès", "Le cours a été envoyé !");
                console.log(data);
            } else {
                console.error("Erreur serveur:", data);
                Alert.alert("Erreur", "Échec de l'envoi");
            }

        } catch (err) {
            console.error("Erreur réseau:", err);
            Alert.alert("Erreur", "Impossible de contacter le serveur");
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
        }else{

        }
    };




    return(
        <View style={styles.container}>
            <PlatformPressable onPress={()=>{navigation.goBack()}}>
                <Image style={styles.backArrow} source={require("../../assets/icons/back.png")}></Image>
            </PlatformPressable>
            <Text style={globalStyles.title}>Créer un cours</Text>
            <View>
                <Text style={styles.subtitle}>Informations générales</Text>
                <Text style={styles.inputContainer}>Nom du cours</Text>
                <Input maxLength={64} value={courseTitle} onChangeText={setCourseTitle} />
                <Text style={styles.inputContainer}>Description du cours</Text>
                <Input maxLength={256} value={courseDescription} onChangeText={setCourseDescription} multiline={true} numberOfLines={4} />
                <Text style={styles.inputContainer}>{pdfFile?pdfFile.assets[0].name:""}</Text>
                <TouchableOpacity style={styles.editPictureBtn} onPress={() => getPdf()}>
                    <Text style={styles.editPictureBtnText}>{pdfFile?"Modifier le pdf":"Ajouter un pdf"}</Text>
                </TouchableOpacity>
                <Text style={styles.inputContainer}>Tags</Text>
                <Text style={[styles.inputContainer,{fontStyle:'italic'}]}>Coming sooon</Text>
            </View>
            <Text style={styles.subtitle}>Chapitres</Text>
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
                <Btn_Fill title={"Sauvegarder"} onPress={()=>postData()}/>
                <Btn_Fill title={"Supprimer"}/>
            </View>
        </View>
    )
}


export default CreateCourseScreen;
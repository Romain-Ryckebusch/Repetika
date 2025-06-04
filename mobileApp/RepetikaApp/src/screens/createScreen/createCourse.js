import {View, Text, Pressable, Image, TouchableOpacity} from "react-native";
import Input from "../../components/frm_input";
import styles from "../../styles/createCourse/createCourse.style"
import globalStyles from "../../styles/global";
import {useState} from "react";
import Btn_Fill from "../../components/btn_fill";
import ScreenWrapper from "../../components/navigation/screenWrapper";
import {navigate} from "../../navigation/NavigationService";
import colors from "../../styles/colors";
import {PlatformPressable} from "@react-navigation/elements";
import {useNavigation} from "@react-navigation/native";


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


    const [chapterList,setChapterList] = useState([
        {id:"fjefneifn",title:"Introduction"},
        {id:"fjefneigf",title:"Chapitre 1"},
        {id:"fjefneigh",title:"Chapitre 2"},
        {id:"fjefneiga",title:"Chapitre 1.5"},
    ]);


    const moveItem = (fromIndex, change) => {
        console.log(fromIndex+change)
        if(fromIndex+change >=0 && fromIndex+change <= chapterList.length-1) {
            setChapterList(prevItems => {
                const updatedItems = [...prevItems]; // 1. Copier
                const [movedItem] = updatedItems.splice(fromIndex, 1); // 2. Supprimer
                updatedItems.splice(fromIndex + change, 0, movedItem); // 3. Insérer
                return updatedItems; // 4. Mettre à jour
            });
        }else{
            console.log("Fin ou début de colonne")
        }
    };


    const postData = async () => {
        //Post
    }

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
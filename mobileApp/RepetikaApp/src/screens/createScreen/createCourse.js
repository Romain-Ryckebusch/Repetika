import {View, Text, Pressable, Image, TouchableOpacity} from "react-native";
import Input from "../../components/frm_input";
import styles from "../../styles/createCourse/createCourse.style"
import globalStyles from "../../styles/global";
import {useState} from "react";
import Btn_Fill from "../../components/btn_fill";
import ScreenWrapper from "../../components/navigation/screenWrapper";
import {navigate} from "../../navigation/NavigationService";
import colors from "../../styles/colors";


const ChapterBox = ({id,name})=>{

    return(
        <View style={styles.chapterBox}>
            <View style={styles.chapterBox.leftBox}>
                <Text style={styles.chapterBox.leftBox.title}>{name}</Text>
                <Btn_Fill title={"Modifier"} style={styles.chapterBox.leftBox.btn} onPress={()=>editChapter(id)}/>
            </View>
            <View style={styles.chapterBox.rightBox}>
                <Pressable style={styles.chapterBox.rightBox.btn} onPress={()=>{}}>
                    <Image style={styles.chapterBox.rightBox.img} source={require("../../assets/icons/upArrow.png")}></Image>
                </Pressable>
                <Pressable style={styles.chapterBox.rightBox.btn} onPress={()=>{}}>
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
    console.log(id);
}




const CreateCourseScreen =  () => {


    const [courseTitle,setCourseTitle] = useState("");
    const [courseDescription,setCourseDescription] = useState("");


    const [chapterList,setChapterList] = useState([
        {id:"fjefneifn",title:"Introduction"},
        {id:"fjefneign",title:"Chapitre 1"},
    ]);



    const postData = async () => {
        //Post
    }

    return(
        <View style={styles.container}>
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
                {chapterList.map((item)=>{
                    return(
                        <ChapterBox key={item.id} id={item.id} name={item.title}/>
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
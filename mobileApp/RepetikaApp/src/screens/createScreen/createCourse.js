import {View, Text, Pressable, Image} from "react-native";
import Input from "../../components/frm_input";
import styles from "../../styles/createCourse/createCourse.style"
import globalStyles from "../../styles/global";
import {useState} from "react";
import Btn_Fill from "../../components/btn_fill";
import ScreenWrapper from "../../components/navigation/screenWrapper";


const ChapterBox = ({id,name})=>{

    return(
        <View style={styles.chapterBox}>
            <View style={styles.chapterBox.leftBox}>
                <Text style={styles.chapterBox.leftBox.title}>{name}</Text>
                <Btn_Fill title={"Modifier"} style={styles.chapterBox.leftBox.btn}/>
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


const CreateCourseScreen =  () => {


    const [courseTitle,setCourseTitle] = useState("");
    const [courseDescription,setCourseDescription] = useState("");


    return(
        <View style={styles.container}>
            <Text style={globalStyles.title}>Créer un cours</Text>
            <View>
                <Text style={styles.subtitle}>Informations générales</Text>
                <Text style={styles.inputContainer}>Nom du cours</Text>
                <Input maxLength={64} value={courseTitle} onChangeText={setCourseTitle} />
                <Text style={styles.inputContainer}>Description du cours</Text>
                <Input maxLength={256} value={courseDescription} onChangeText={setCourseDescription} multiline={true} />
                <Text style={styles.inputContainer}>Tags</Text>
                <Text style={[styles.inputContainer,{fontStyle:'italic'}]}>Coming sooon</Text>
            </View>
            <ScreenWrapper scrollable>
                <Text style={styles.subtitle}>Chapitres</Text>
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
                <ChapterBox name={"Introduction"} />
            </ScreenWrapper>

            <View style={styles.btnView}>
                <Btn_Fill title={"Sauvegarder"}/>
                <Btn_Fill title={"Supprimer"}/>
            </View>
        </View>
    )
}


export default CreateCourseScreen;
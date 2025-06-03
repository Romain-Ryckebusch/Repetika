import globalStyles from "../../styles/global";
import {View, Text, TextInput,Image} from "react-native";
import {useRoute} from "@react-navigation/native";
import {useState} from "react";
import styles from "../../styles/createCourse/createChapter.style";
import Input from "../../components/frm_input";
import {PlatformPressable} from "@react-navigation/elements";
import Btn_Fill from "../../components/btn_fill";
import ScreenWrapper from "../../components/navigation/screenWrapper";



const JoinedInput = ({label,placeholder,value,onChangeText}) => {
    return(
        <View >
            <Text style={styles.joinedInputContainer.label}>{label}</Text>
            <View style={styles.joinedInputContainer.joinedInputView}>
                <TextInput style={styles.joinedInputContainer.cardInput} placeholder={placeholder} value={value} onChangeText={onChangeText}/>
                <PlatformPressable>
                    <Image source={require("../../assets/icons/clip.png")} style={{width:30,height:30}}/>
                </PlatformPressable>

            </View>
        </View>
    )
}



const CreateChapter = ()=>{
    const route = useRoute();
    const chapterId = route.params?.chapterId ?? null;

    const [chapterName,setChapterName] = useState("");
    const [rectoInput,setRectoInput] = useState("");
    const [versoInput,setVersoInput] = useState("");

    const [cardsList,setCardsList] = useState([]);

     //si l'id exist, on récuperera les infos depuis la bdd


    const addCard=(recto,verso)=>{
        setCardsList(prevState => [...prevState,{recto:recto,verso:verso,saved:false}]);

    }


    return(
        <View style={styles.container}>
            <Text style={globalStyles.title}>{chapterName}</Text>
            <Text style={styles.inputContainer}>Nom du chapitre</Text>
            <Input maxLength={64} value={chapterName} onChangeText={setChapterName} />


            <View>
                <Text style={globalStyles.title}>Ajouter une carte</Text>
                <JoinedInput label={"Recto :"} placeholder={"Question"} value={rectoInput} onChangeText={setRectoInput} />
                <JoinedInput label={"Verso :"} placeholder={"Réponse"} value={versoInput} onChangeText={setVersoInput} />
                <Btn_Fill title={"Ajouter"} style={{marginTop:16}} onPress={()=>addCard(rectoInput,versoInput)} />
            </View>

                <Text style={globalStyles.title}>Cartes du chapitre</Text>
                <ScreenWrapper scrollable style={styles.chapterList}>
                {
                    cardsList.map((card,i)=>{
                        return (
                            <View style={[styles.card]}>
                                <Text style={styles.card.text} key={i}>{card.recto}</Text>
                            </View>
                        )
                    })
                }
                </ScreenWrapper>

            <Btn_Fill title={"Sauvegarder"}/>

        </View>
    )
}



export default CreateChapter;
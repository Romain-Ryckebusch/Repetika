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
    const [inputModeEdit,setInputModeEdit] = useState(false);
    const [idCardToEdit,setIdCardToEdit] = useState(null);

    const [cardsList,setCardsList] = useState([]);

     //si l'id exist, on récuperera les infos depuis la bdd


    const generateFakeObjectId = () => {
        const timestamp = Math.floor(Date.now() / 1000).toString(16);
        const random = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
            Math.floor(Math.random() * 16).toString(16)
        );
        return `ObjectId("${timestamp}${random}")`;
    };


    const addCard=(recto,verso)=>{
        setCardsList(prevState => [...prevState,{id:generateFakeObjectId(), recto:recto,verso:verso,saved:false}]);
        setRectoInput("");
        setVersoInput("");
    }

    const editCard=(id)=>{
        const cardToEdit = cardsList.find(card => card.id === id);
        setRectoInput(cardToEdit.recto);
        setVersoInput(cardToEdit.verso);
        setInputModeEdit(true);
        setIdCardToEdit(cardToEdit.id);
    }

    const saveEditedCard=(id)=>{
        setCardsList(prevState =>
            prevState.map(card =>
                card.id === id
                    ? { ...card, ...{recto:rectoInput,verso:versoInput} }
                    : card
            )
        );
        setVersoInput("");
        setRectoInput("");
        setInputModeEdit(false);
        setIdCardToEdit(null);
    }

    const deleteCars=(id)=>{
        setCardsList(prevState => prevState.filter(card => card.id !== id));
    }


    return(
        <View style={styles.container}>
            <Text style={globalStyles.title}>{chapterName}</Text>
            <Text style={styles.inputContainer}>Nom du chapitre</Text>
            <Input maxLength={64} value={chapterName} onChangeText={setChapterName} />


            <View style={styles.formView}>
                <Text style={globalStyles.title}>Ajouter une carte</Text>
                <JoinedInput label={"Recto :"} placeholder={"Question"} value={rectoInput} onChangeText={setRectoInput} />
                <JoinedInput label={"Verso :"} placeholder={"Réponse"} value={versoInput} onChangeText={setVersoInput} />
                <Btn_Fill title={inputModeEdit?"Modifier":"Ajouter"} style={{marginTop:16}} onPress={!inputModeEdit?()=>addCard(rectoInput,versoInput):()=>saveEditedCard(idCardToEdit)} />
            </View>

                <Text style={globalStyles.title}>Cartes du chapitre</Text>
                <ScreenWrapper scrollable style={styles.chapterList}>
                {
                    cardsList.map((card,i)=>{
                        return (
                            <View style={[styles.card]} key={card.id}>
                                <Text style={styles.card.text} >{card.recto}</Text>
                                <PlatformPressable onPress={()=>editCard(card.id)}>
                                    <Image source={require('../../assets/icons/edit.png')} style={styles.card.icon}></Image>
                                </PlatformPressable>
                                <PlatformPressable onPress={()=>deleteCars(card.id)}>
                                    <Image source={require('../../assets/icons/delete.png')} style={styles.card.icon}></Image>
                                </PlatformPressable>
                            </View>
                        )
                    })
                }
                </ScreenWrapper>

            <Btn_Fill title={"Sauvegarder"} style={{marginBottom:32, marginTop:16}}/>

        </View>
    )
}



export default CreateChapter;
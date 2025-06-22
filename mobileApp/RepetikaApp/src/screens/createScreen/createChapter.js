import globalStyles from "../../styles/global";
import {View, Text, TextInput,Image} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useContext, useEffect, useState} from "react";
import styles from "../../styles/createCourse/createChapter.style";
import Input from "../../components/frm_input";
import {PlatformPressable} from "@react-navigation/elements";
import Btn_Fill from "../../components/btn_fill";
import ScreenWrapper from "../../components/navigation/screenWrapper";
import {CreateCourseContext} from "../../utils/CreateCourseContext";
import {useEvent} from "expo";
import {useTranslation} from "react-i18next";




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
    const navigation = useNavigation();
    const {t}=useTranslation();

    const chapterId = route.params?.chapterId ?? null;

    const [chapterName,setChapterName] = useState("");
    const [rectoInput,setRectoInput] = useState("");
    const [versoInput,setVersoInput] = useState("");
    const [inputModeEdit,setInputModeEdit] = useState(false);
    const [idCardToEdit,setIdCardToEdit] = useState(null);

    const {chapterList,setChapterList,cardsListByChapter,setCardsListByChapter} = useContext(CreateCourseContext)

    const [cardsList,setCardsList] = useState([]);




    useEffect(() => {
        if(chapterId){
            setChapterName(chapterList.find(item=>item.id === chapterId).title);
            setCardsList(cardsListByChapter.find(item => item.chapterId === chapterId).cards)
        }
    }, []);


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
        setRectoInput("")
        setInputModeEdit(false);
        setIdCardToEdit(null);
    }

    const deleteCars=(id)=>{
        setCardsList(prevState => prevState.filter(card => card.id !== id));
    }

    const saveChapter=()=>{
        if(chapterId){
            let chapterCards = cardsListByChapter.find(item => item.chapterId === chapterId);
            let chapterData = chapterList.find(item=>item.id === chapterId);
            chapterData.title=chapterName;
            chapterCards.cards=cardsList
            setCardsListByChapter(prev =>
                prev.map(item =>
                    item.chapterId === chapterId
                        ? { ...item, cards: cardsList }
                        : item
                )
            );

            setChapterList(prev =>
                prev.map(item =>
                    item.id === chapterId
                        ? { ...item, title: chapterName }
                        : item
                )
            );
        }else {
            const id = Date.now()
            setChapterList(prev => [...prev, {"id": id, "title": chapterName}]);
            setCardsListByChapter(prev => [...prev, {"chapterId": id, "cards": cardsList}]);
        }
        navigation.navigate("CreateCourseScreen");
    }

    return(
        <View style={styles.container}>
            <PlatformPressable onPress={()=>{navigation.goBack()}}>
                <Image style={styles.backArrow} source={require("../../assets/icons/back.png")}></Image>
            </PlatformPressable>
            <Text style={globalStyles.title}>{chapterName}</Text>
            <Text style={styles.inputContainer}>{t("CreateChapterPage.ChapterNameLabel")}</Text>
            <Input maxLength={64} value={chapterName} onChangeText={setChapterName} />


            <View style={styles.formView}>
                <Text style={globalStyles.title}>{t("CreateChapterPage.Subtitle")}</Text>
                <JoinedInput label={t("CreateChapterPage.Recto")} placeholder={t("CreateChapterPage.Question")} value={rectoInput} onChangeText={setRectoInput} />
                <JoinedInput label={t("CreateChapterPage.Verso")} placeholder={t("CreateChapterPage.Reponse")} value={versoInput} onChangeText={setVersoInput} />
                <Btn_Fill title={inputModeEdit?t("CreateChapterPage.Edit"):t("CreateChapterPage.Add")} style={{marginTop:16}} onPress={!inputModeEdit?()=>addCard(rectoInput,versoInput):()=>saveEditedCard(idCardToEdit)} />
            </View>

                <Text style={globalStyles.title}>{t("CreateChapterPage.ChapterCards")}</Text>
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

            <Btn_Fill title={t("CreateChapterPage.Save")} style={{marginBottom:32, marginTop:16}} onPress={()=>saveChapter()}/>

        </View>
    )
}



export default CreateChapter;
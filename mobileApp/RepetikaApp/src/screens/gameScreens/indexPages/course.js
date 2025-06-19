import {View, Text, Dimensions,Image} from "react-native";


import styles from '../../../styles/game/courseIndex.style';
import colors from '../../../styles/colors';


import {navigate} from "../../../navigation/NavigationService";
import {PlatformPressable} from "@react-navigation/elements";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../utils/AuthContext";
import useFetch from "../../../utils/useFetch";

/*
const course=[
    {
        "id":1,
        "title":"Western europe",
        "isSrarted":true,
        "isFinished":true,
        "isAvailable":true,
    },
    {
        "id":2,
        "title":"Southern europe",
        "isSrarted":true,
        "isFinished":false,
        "isAvailable":true,
    },
    {
        "id":3,
        "title":"Northern europe",
        "isSrarted":false,
        "isFinished":false,
        "isAvailable":false,
    },
    {
        "id":5,
        "title":"Eastern Europe",
        "isSrarted":false,
        "isFinished":false,
        "isAvailable":false,
    }
]
*/
export default function Course ({courseId,deckId}){

    const {userId} = useContext(AuthContext);
    console.log(courseId);
    const url = `http://192.168.198.203:8000/api/main/getCourseChapters?user_id=${userId}&id_course=${courseId}`;
    console.log(url);

    const [course, setCourse] = useState([]);
    const [lineList,setLineList] = useState([]);

    const { data, loading, error } = useFetch(url);

    useEffect(() => {
        if (data) {
            setCourse(data);
            console.log(data)
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    useEffect(() => {
        if(course.length > 0){
            const newLineList = [];
            for(let i = 0; i < course.length - 1; i++){
                newLineList.push(i % 2 === 0 ? '45deg' : '-45deg');
            }
            setLineList(newLineList);
        }
    }, [course]);


    const leftChapters = course.filter((_, index) => index % 2 === 0);
    const rightChapters = course.filter((_, index) => index % 2 === 1);

    const screenWidth = Dimensions.get('window').width;
    const widthCircle = screenWidth*0.3; // 80% d'un tiers de la largeur écran
    const heightCourse= widthCircle+16+8;

    const navigateCourseFrame = (id)=>{
        navigate("CourseFrame", {
            chapterId: id,
            deckId:deckId
        });

    }


    return (
        <View style={styles.coursePage.view}>
            <View style={[styles.coursePage.view.sideColumn,{alignItems:"flex-end"}]}>
                {leftChapters.map(chapter => (
                    <PlatformPressable onPress={()=>navigateCourseFrame(chapter.id_chapitre)} key={chapter.id} style={[{marginBottom:heightCourse}]} /*disabled={!chapter.isAvailable}*/ disabled={false}>
                        <View  style={[styles.coursePage.chapterView,{width:widthCircle,height:widthCircle,borderRadius:0.5*widthCircle},{backgroundColor:chapter.isSrarted&&!chapter.isFinished?colors.currentChapter:!chapter.isAvailable?colors.lockedChapter:colors.primary}]}>
                            {!chapter.isAvailable?<Image style={[styles.coursePage.chapterView.icon]} source={require("../../../assets/icons/lock.png")}/>:null}
                        </View>
                        <Text style={styles.coursePage.chapterView.title}>{chapter.title}</Text>
                    </PlatformPressable>
                ))}
            </View>
            <View id={"centerColumn"} style={[styles.coursePage.view.centerColumn,{height:lineList.length*heightCourse,marginTop:0.5*heightCourse}]}>
                {lineList.map(line=>{
                    return (<View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: line }],width:Math.sqrt(2)*heightCourse}]} />)
                })}

            </View>
            <View style={[styles.coursePage.view.sideColumn,{alignItems:"flex-end"}]}>
                {rightChapters.map(chapter => (
                    <PlatformPressable onPress={()=>navigateCourseFrame(chapter.id_chapitre)} key={chapter.id} style={[{marginTop:heightCourse}]} disabled={!chapter.isAvailable}>
                        <View  style={[styles.coursePage.chapterView,{width:widthCircle,height:widthCircle,borderRadius:0.5*widthCircle},{backgroundColor:chapter.isSrarted&&!chapter.isFinished?colors.currentChapter:!chapter.isAvailable?colors.lockedChapter:colors.primary}]}>
                            {!chapter.isAvailable?<Image style={[styles.coursePage.chapterView.icon]} source={require("../../../assets/icons/lock.png")}/>:null}
                        </View>
                        <Text style={styles.coursePage.chapterView.title}>{chapter.title}</Text>
                    </PlatformPressable>
                ))}
            </View>
        </View>

    );
};






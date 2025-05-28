import {View, Text, Dimensions,Image} from "react-native";


import styles from '../../../styles/game/courseIndex.style';
import colors from '../../../styles/colors';


import {navigate} from "../../../navigation/NavigationService";
import {PlatformPressable} from "@react-navigation/elements";


const course=[
    {
        "id":1,
        "title":"Introduction",
        "isSrarted":true,
        "isFinished":true,
        "isAvailable":true,
    },
    {
        "id":2,
        "title":"L'art de la diplomatie",
        "isSrarted":true,
        "isFinished":false,
        "isAvailable":true,
    },
    {
        "id":3,
        "title":"L'art de la guerre",
        "isSrarted":false,
        "isFinished":false,
        "isAvailable":false,
    },
    {
        "id":4,
        "title":"L'homme préhistorique",
        "isSrarted":false,
        "isFinished":false,
        "isAvailable":false,
    }
]

export default function Course (){

    const leftChapters = course.filter((_, index) => index % 2 === 0);
    const rightChapters = course.filter((_, index) => index % 2 === 1);

    const screenWidth = Dimensions.get('window').width;
    const widthCircle = screenWidth*0.3; // 80% d'un tiers de la largeur écran
    const heightCourse= widthCircle+16+8;
    return (
        <View style={styles.coursePage.view}>
            <View style={[styles.coursePage.view.sideColumn,{alignItems:"flex-end"}]}>
                {leftChapters.map(chapter => (
                    <PlatformPressable onPress={()=>navigate("CourseFrame")} key={chapter.id} style={[{marginBottom:heightCourse}]} >
                        <View  style={[styles.coursePage.chapterView,{width:widthCircle,height:widthCircle,borderRadius:0.5*widthCircle},{backgroundColor:chapter.isSrarted&&!chapter.isFinished?colors.currentChapter:!chapter.isAvailable?colors.lockedChapter:colors.primary}]}>
                            {!chapter.isAvailable?<Image style={[styles.coursePage.chapterView.icon]} source={require("../../../assets/icons/lock.png")}/>:null}
                        </View>
                        <Text style={styles.coursePage.chapterView.title}>{chapter.title}</Text>
                    </PlatformPressable>
                ))}
            </View>
            <View id={"centerColumn"} style={[styles.coursePage.view.centerColumn,{height:3*heightCourse,marginTop:0.5*heightCourse}]}>
                <View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: '45deg' }],width:Math.sqrt(2)*heightCourse}]} />
                <View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: '-45deg' }],width:Math.sqrt(2)*heightCourse}]} />
                <View style={[styles.coursePage.view.centerColumn.line,{transform: [{ rotate: '45deg' }],width:Math.sqrt(2)*heightCourse}]} />
            </View>
            <View style={[styles.coursePage.view.sideColumn,{alignItems:"flex-end"}]}>
                {rightChapters.map(chapter => (
                    <PlatformPressable onPress={()=>navigate("CourseFrame")} key={chapter.id} style={[{marginTop:heightCourse}]} >
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






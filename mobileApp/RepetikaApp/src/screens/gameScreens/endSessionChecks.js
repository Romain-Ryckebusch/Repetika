import {View,Text,Image,Animated} from "react-native";
import styles from "../../styles/game/endSessionCheck.style";
import globalStyles from "../../styles/global";
import {useRef} from "react";

const streak = require("../../assets/icons/streakIcon.png")
const streakDisabled= require("../../assets/icons/streakIconDisabeld.png")

const StreakView=({streak,date})=>{
    const newStreak=streak+1;
    const animatedStreakPos = newStreak>=4?3:streak
    let tab = []
    for(let i=0;i<animatedStreakPos;i++){
        tab.push("active")
    }
    tab.push("today")
    for(let i=animatedStreakPos+1;i<6;i++){
        tab.push("inactive")
    }
    return(
        <View style={styles.container}>
            <Text style={globalStyles.title}>Cela fait{"\n"}<Text style={styles.streak.number}>{newStreak}</Text>{"\n"}jours que tu t'entraines</Text>
            <View style={styles.streak.list}>
            {
                tab.map((row,index)=>{
                    return (<Streak day={"M"} status={row}/>)
                })
            }
            </View>
        </View>
    )
}



const Streak=({day,status})=>{
    if(status!=="today") {
        let source = streakDisabled
        if(status==="active"){
            source = streak;
        }
        return (
            <View>
                <Image style={styles.streak.list.image} source={source}/>
                <Text style={styles.streak.list.text}>{day}</Text>
            </View>
        )
    }else{
        const fadeAnim = useRef(new Animated.Value(0)).current;
        const toogleFlamme = () => {
            Animated.timing(fadeAnim, {
                toValue: 1, // Passe de 0 à 1 ou 1 à 0
                duration: 1000,
                useNativeDriver: true,
            }).start();
        };

        toogleFlamme();

        return (
            <View>
                <View style={styles.container}>
                    {/* Flamme grise en fond */}
                    <Image source={streakDisabled} style={[styles.streak.list.image,styles.streak.list.image.animated]} />

                    {/* Flamme orange au-dessus, avec opacité animée */}
                    <Animated.Image
                        source={streak}
                        style={[styles.streak.list.image, { opacity: fadeAnim }]}
                    />
                </View>
                <Text style={styles.streak.list.text}>{day}</Text>
            </View>
        )

    }
}


const EndSessionChecks = ()=>{

    const initialPlayerData={
        streak:5,
        lastSessionDate:new Date("2025-05-29"),
    }


    return(
        <StreakView streak={initialPlayerData.streak} date={initialPlayerData.lastSessionDate}/>
    )
}




export default EndSessionChecks;
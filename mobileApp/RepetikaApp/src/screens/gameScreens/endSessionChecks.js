import React, {useEffect, useState} from "react";

import {navigate} from "../../navigation/NavigationService";

import StreakView from "../progressScreens/streakScreen";
import TrophyView from "../progressScreens/trophyScreen";
import XpView from "../progressScreens/xpScreen";










function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function isYesterday(dateAComparer) {
    const maintenant = new Date();

    // Date d'hier (à minuit)
    const hier = new Date(maintenant);
    hier.setDate(hier.getDate() - 1);
    hier.setHours(0, 0, 0, 0);

    // Date de fin d'hier (23:59:59)
    const finHier = new Date(hier);
    finHier.setHours(23, 59, 59, 999);

    // Comparaison
    return dateAComparer >= hier && dateAComparer <= finHier;
}








const EndSessionChecks = () => {
    const initialPlayerData = {
        streak: 6,
        lastSessionDate: new Date("2025-06-01"),
        xp:630
    };


    const [showXpView, setShowXpView] = useState(true);
    const [showStreakView, setShowStreakView] = useState(!isSameDate(initialPlayerData.lastSessionDate,new Date()));
    const [TrophyToShow, setTrophyToShow] = useState([
        {title:"Hard worker",description:"Work 500 cards"},
        {title:"Studius",description: "Work 7 days in a row"}
    ]);

    const xpNextAction = ()=>{
        setShowXpView(false);
        navigate("endSessionChecks");
    }

    const streakNextAction =()=>{
        setShowStreakView(false);
        navigate("endSessionChecks");
    }

    const trophyNextAction = ()=>{
        setTrophyToShow(prev => prev.slice(1));
        navigate("endSessionChecks")
    }

    useEffect(() => {
        if (!showStreakView && TrophyToShow.length === 0) {
            navigate("CourseIndex");
        }
    }, [showStreakView, TrophyToShow]);

    if(showXpView){
        let xp = initialPlayerData.xp;
        let addXp=250;
        return (
            <XpView oldXp={xp} addXp={addXp} nextAction={()=>xpNextAction()}/>
        )
    }

    if (showStreakView) {
        let streakNumber = 0
        if(isYesterday(initialPlayerData.lastSessionDate)) {
            streakNumber = initialPlayerData.streak;
        }
        return (
            <StreakView
                streak={streakNumber}
                date={initialPlayerData.lastSessionDate}
                onPress={()=>streakNextAction()}
            />
        );
    }else if(TrophyToShow.length !== 0) {
        return(
            <TrophyView title={TrophyToShow[0].title} description={TrophyToShow[0].description} onPress={()=>{trophyNextAction()}} />
        )
    }
};

export default EndSessionChecks;

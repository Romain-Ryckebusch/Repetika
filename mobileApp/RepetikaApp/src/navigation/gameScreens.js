
//pages
import HomeScreen from '../screens/HomeScreen';
//autres
import { useTranslation } from 'react-i18next';

import {useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CourseIndex from "../screens/gameScreens/courseIndex";
import ReviewFrame from "../screens/gameScreens/reviewFrame";
import React from "react";
import userProfilePicture from "../assets/Profile.png";
import CourseFrame from "../screens/gameScreens/courseFrame";
import ProfileScreen from "../screens/ProfileScreen";
import EndSessionChecks from "../screens/gameScreens/endSessionChecks";






const Stack = createNativeStackNavigator();

const GameScreens=()=> {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <Stack.Navigator
            id={"appTabsNavigator"}
        >
            <Stack.Screen name="CourseIndex"  options={{headerShown:false}} component={CourseIndex}/>
            <Stack.Screen name="ReviewFrame"  options={{headerShown:false}} component={ReviewFrame}/>
            <Stack.Screen name="CourseFrame"  options={{headerShown:false}} component={CourseFrame}/>
            <Stack.Screen name="endSessionChecks" options={{headerShown:false}} component={EndSessionChecks}/>
        </Stack.Navigator>
    );
}

export default GameScreens;

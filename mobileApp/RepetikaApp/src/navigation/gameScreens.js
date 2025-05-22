
//pages
import HomeScreen from '../screens/HomeScreen';
//autres
import { useTranslation } from 'react-i18next';

import {useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CourseIndex from "../screens/gameScreens/courseIndex";
import ReviewFrame from "../styles/game/reviewFrame";
import React from "react";






const Stack = createNativeStackNavigator();

const GameScreens=()=> {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <Stack.Navigator
            id={"appTabsNavigator"}
        >
            <Stack.Screen name="CourseIndex" options={{headerShown:false}} component={CourseIndex}/>
            <Stack.Screen name="ReviewFrame" options={{headerShown:false}} component={ReviewFrame}/>
        </Stack.Navigator>
    );
}

export default GameScreens;

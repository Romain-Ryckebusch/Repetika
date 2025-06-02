
//pages
import HomeScreen from '../screens/HomeScreen';
//autres
import { useTranslation } from 'react-i18next';

import {useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import React from "react";

import CreateCourseScreen from "../screens/createScreen/createCourse";






const Stack = createNativeStackNavigator();

const CreateCourseScreens=()=> {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <Stack.Navigator
            id={"createCourseNavigator"}
        >
            <Stack.Screen name="CreateCourseScreen"  options={{headerShown:false}} component={CreateCourseScreen}/>

        </Stack.Navigator>
    );
}

export default CreateCourseScreens;

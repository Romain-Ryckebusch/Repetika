
//pages
import HomeScreen from '../screens/HomeScreen';
//autres
import { useTranslation } from 'react-i18next';

import {useNavigation} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import React from "react";

import CreateCourseScreen from "../screens/createScreen/createCourse";
import CreateChapter from "../screens/createScreen/createChapter";
import {CreateCourseProvider} from "../utils/CreateCourseContext";






const Stack = createNativeStackNavigator();

const CreateCourseScreens=()=> {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <CreateCourseProvider>
            <Stack.Navigator
                id={"createCourseNavigator"}
            >
                <Stack.Screen name="CreateCourseScreen"  options={{headerShown:false}} component={CreateCourseScreen}/>
                <Stack.Screen name={"CreateChapterScreen"} options={{headerShown:false}} component={CreateChapter}/>
            </Stack.Navigator>
        </CreateCourseProvider>
    );
}

export default CreateCourseScreens;

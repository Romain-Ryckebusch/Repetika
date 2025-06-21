import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthTabs from './AuthTabs';
import AppTabs from './AppTabs';
import Header from '../components/navigation/Header';
import SettingsScreen from '../screens/SettingsScreen';
import GameScreens from './gameScreens';
import UserProfileScreen from '../screens/UserProfileScreen';
import CreateCourseScreens from './createCourseScreen';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import { getSession } from '../utils/session';
import ChooseCoursesScreen from '../screens/ChooseCoursesScreen';


const Stack = createNativeStackNavigator();
const userProfilePicture = require('../assets/Profile.png');

export default function RootNavigator() {
    const { tokenAccess, setTokenAccess,tokenRefresh,setTokenRefresh, userId, setUserId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true); // pour l'écran de chargement

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (session.tokenAccess) {
                setTokenAccess(session.tokenAccess);
                setTokenRefresh(session.tokenRefresh);
                setUserId(session.userId)

            }

            setLoading(false);

        };
        checkSession();
    }, []);

    if (loading) {
        // Pendant que la session est vérifiée
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={tokenAccess ? 'MainApp' : 'Auth'}
            screenOptions={{
                header: ({ navigation, route, options, back }) => (
                    <Header
                        xp={500}
                        streakDays={12}
                        profilePicture={userProfilePicture}
                    />
                ),
                headerStyle: { height: 120 },
            }}
        >

                <Stack.Screen
                    name="Auth"
                    component={AuthTabs}
                    options={{ headerShown: false }}
                />


                    <Stack.Screen
                        name="MainApp"
                        component={AppTabs}
                        options={{ headerShown: true }}
                    />

                    <Stack.Screen
                        name="userProfileScreen"
                        component={UserProfileScreen}
                        options={{ headerShown: true }}
                    />

                    <Stack.Screen
                        name="settingsScreen"
                        component={SettingsScreen}
                        options={{ headerShown: true }}
                    />

                    <Stack.Screen
                        name="gameScreens"
                        component={GameScreens}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="createCourseScreens"
                        component={CreateCourseScreens}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                    name="ChooseCourses"
                    component={ChooseCoursesScreen}
                    options={{ headerShown: false }}
                    />


        </Stack.Navigator>
    );
}

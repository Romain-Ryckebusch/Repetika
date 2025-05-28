import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthTabs from './AuthTabs';
import AppTabs from './AppTabs';
import Header from '../components/navigation/Header';
import SettingsScreen from '../screens/SettingsScreen'
import GameScreens from '../navigation/gameScreens';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createNativeStackNavigator();

const userProfilePicture = require('../assets/Profile.png'); // si besoin

export default function RootNavigator() {
    const showAuth = true   ;
    return (
        <Stack.Navigator
            initialRouteName={showAuth ? "Auth" : "MainApp"}
            screenOptions={{
                header: ({ navigation, route, options, back }) => (
                    // Afficher ton Header personnalisé ici
                    <Header
                        progress={50}
                        lvl={8}
                        streakDays={12}
                        profilePicture={userProfilePicture}
                    />
                ),
                headerStyle: { height: 120 },
            }}

            id="navigator"
        >

                <Stack.Screen
                    name="Auth"
                    component={AuthTabs}
                    options={{ headerShown: false }} // pas de header sur Auth
                />

                <>
                    <Stack.Screen
                        name="MainApp"
                        component={AppTabs}
                        options={{ headerShown: true }} // header affiché sur AppTabs
                    />

                    <Stack.Screen
                        name="userProfileScreen"
                        component={UserProfileScreen}
                        options={{headerShown:true}}
                    />

                    <Stack.Screen
                        name="settingsScreen"
                        component={SettingsScreen}
                        options={{headerShown:true}}
                    />

                    <Stack.Screen
                        name="gameScreens"
                        component={GameScreens}
                        options={{headerShown:false}}
                    />

                </>

        </Stack.Navigator>
    );
}

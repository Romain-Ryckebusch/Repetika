// navigation/RootNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useAuth } from '../hooks/useAuth'; // hook fictif pour la logique d'auth

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { isAuthenticated, isFirstLaunch } = useAuth();

    const showAuth = !isAuthenticated || isFirstLaunch;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showAuth ? (
                <Stack.Screen name="Auth" component={AuthStack} />
            ) : (
                <Stack.Screen name="MainApp" component={AppTabs} />
            )}
        </Stack.Navigator>
    );
}

// navigation/RootNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthTabs from './AuthTabs';
import AppTabs from './AppTabs';


const Stack = createNativeStackNavigator();

export default function RootNavigator() {


    const showAuth = false;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showAuth ? (
                <Stack.Screen name="Auth" component={AuthTabs} />
            ) : (
                <Stack.Screen name="MainApp" component={AppTabs} />
            )}
        </Stack.Navigator>
    );
}

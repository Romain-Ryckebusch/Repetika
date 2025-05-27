import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/onBoarding/Register';
import LoginScreen from '../screens/onBoarding/LoginScreen';


const Stack = createNativeStackNavigator();

export default function AuthTabs() {
    const isFirstConnexion = true;
    return (
        <Stack.Navigator id="onboardingNavigator" initialRouteName={isFirstConnexion ? "RegisterScreen" : "Login"}>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>

    );
}

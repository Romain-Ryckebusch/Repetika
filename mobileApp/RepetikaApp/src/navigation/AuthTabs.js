import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import RegisterScreen from '../screens/Register';
import LoginScreen from '../screens/LoginScreen';


const Stack = createNativeStackNavigator();
// <Stack.Screen name="Register" component={RegisterScreen} />

export default function AuthTabs() {
    return (
        <Stack.Navigator>

            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}

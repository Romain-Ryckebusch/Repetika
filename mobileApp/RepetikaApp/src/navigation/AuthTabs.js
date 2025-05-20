// navigation/AuthTabs.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/Register';


const Stack = createNativeStackNavigator();

export default function AuthTabs() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import './src/i18n';
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider } from './src/utils/AuthContext';
import {CourseProvider} from "./src/utils/CourseContext";

export default function App() {
    const [fontsLoaded] = useFonts({
        KronaOne_Regular: require('./src/assets/fonts/Krona_One/KronaOne-Regular.ttf'),
        OpenSans_Regular: require('./src/assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
        OpenSans_Bold: require('./src/assets/fonts/Open_Sans/static/OpenSans-Bold.ttf'),
    });



    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthProvider>
            <CourseProvider>
                <NavigationContainer ref={navigationRef}>
                    <RootNavigator />
                </NavigationContainer>
            </CourseProvider>
        </AuthProvider>
    );
}

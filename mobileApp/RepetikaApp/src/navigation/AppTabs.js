// bibliothèques
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//pages
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
//autres
import { useTranslation } from 'react-i18next';
import TabBar from "../components/navigation/bottomNavBar";
import Header from "../components/navigation/Header";
import {useNavigation} from "@react-navigation/native";



const Tab = createBottomTabNavigator();

const AppTabs=()=> {
    const { t } = useTranslation();
    const userProfilePicture = require('../assets/Profile.png');
    const navigation = useNavigation();
    return (
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={({ route }) => ({
                animation: 'shift',
                headerShown:false,

            })}
            id={"appTabsNavigator"}
        >
            <Tab.Screen name="Home" options={{title:t('bottomNavbar.home')}}  component={HomeScreen} />
            <Tab.Screen name="Social" options={{title:t('bottomNavbar.social')}} component={ProfileScreen} />
            <Tab.Screen name="Stats" options={{title:t('bottomNavbar.statistics')}} component={ProfileScreen} />
            <Tab.Screen  name="Profile" options={{title:t('bottomNavbar.profile'),headerShown:false}} component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default AppTabs;

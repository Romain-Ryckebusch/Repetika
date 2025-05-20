// bibliothèques
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {View, Text, Image} from 'react-native';
import {PlatformPressable} from '@react-navigation/elements';

//pages
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

//style
import styles from '../styles/AppTabs.style';

//autres
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const tabIcons={
    Home:require("../assets/navbarIcons/cours.png"),
    Profile:require("../assets/navbarIcons/account.png")
}

function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View style={ styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;
                const iconSource = tabIcons[route.name];


                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };


                return (
                    <PlatformPressable style={styles.tabButton} key={route.key}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}

                    >
                        <Image style={styles.navBarIcon} source={iconSource}/>
                        <Text style={isFocused ? styles.tabTextFocused : styles.tabText}>
                            {label}
                        </Text>
                    </PlatformPressable>
                );
            })}
        </View>
    );
}


const AppTabs=()=> {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={{animation:'shift'}}
            id={"appTabsNavigator"}


        >
            <Tab.Screen name="Home" options={{title:t('bottomNavbar.home')}}  component={HomeScreen} />
            <Tab.Screen name="Profile" options={{title:t('bottomNavbar.social')}} component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default AppTabs;

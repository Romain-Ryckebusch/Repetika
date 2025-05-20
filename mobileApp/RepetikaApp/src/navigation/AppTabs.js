// navigation/AppTabs.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {View,Text} from 'react-native';

import {PlatformPressable} from '@react-navigation/elements';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {


    return (
        <View style={{ flexDirection: 'row' }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

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
                    <PlatformPressable
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        style={{ flex: 1 }}
                    >
                        <Text>
                            {label}
                        </Text>
                    </PlatformPressable>
                );
            })}
        </View>
    );
}


const AppTabs=()=> {
    return (
        <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
        >
            <Tab.Screen name="Home"  component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default AppTabs;

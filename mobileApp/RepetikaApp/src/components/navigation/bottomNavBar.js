import {View, Text, Image} from 'react-native';
import {PlatformPressable} from '@react-navigation/elements';
import { Shadow } from 'react-native-shadow-2';

//style
import styles from '../../styles/navigation/AppTabs.style';
import globalStyles from "../../styles/global";



const tabIcons={
    Home:require("../../assets/navbarIcons/cours.png"),
    Social: require("../../assets/navbarIcons/social.png"),
    Stats: require("../../assets/navbarIcons/stats.png"),
    Profile:require("../../assets/navbarIcons/account.png")
}

function TabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel ?? options.title ?? route.name;

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

                // Le contenu du bouton (image + texte)
                const buttonContent = (
                    <PlatformPressable
                        style={isFocused ? styles.tabButtonFocused : styles.tabButton}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                    >
                        <Image
                            style={isFocused ? styles.navBarIconFocused : styles.navBarIcon}
                            source={iconSource}
                            resizeMode="contain"
                        />
                        <Text style={isFocused ? styles.tabTextFocused : styles.tabText}>
                            {label}
                        </Text>
                    </PlatformPressable>
                );

                return (
                    <View key={route.key} style={{ flex: 1, alignItems: 'center' }}>
                        {isFocused ? (
                            <Shadow
                                distance={8}
                                offset={[4, 4]}
                                startColor="rgba(0,0,0,0.25)"
                                containerStyle={{ borderRadius: 20 }}
                            >
                                {buttonContent}
                            </Shadow>
                        ) : (
                            buttonContent
                        )}
                    </View>
                );
            })}
        </View>
    );
}


export default TabBar
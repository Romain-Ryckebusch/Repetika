import { View, Text, TouchableOpacity, ScrollView} from "react-native";

import globalStyles from '../styles/global';
import colors from '../styles/colors';
import styles from '../styles/SocialScreen.style';

import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";



export default function StatisticsScreen() {
    const {t}=useTranslation();
    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>

                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">
                    <Text style={globalStyles.title}>Stats</Text>




                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}


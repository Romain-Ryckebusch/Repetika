import {View, Text, ScrollView, Image, TouchableOpacity, FlatList} from "react-native";
import globalStyles from '../../styles/global';


import ScreenWrapper from "../../components/navigation/screenWrapper";

import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';
import Decoration from "../../components/decoration";
import styles from "../../styles/Register.style";
import {PlatformPressable} from "@react-navigation/elements";

const Item=({text})=>{
    return(
        <PlatformPressable>
            <Text>{text}</Text>
        </PlatformPressable>
    )
}

const DATA = [
    {
        "id": "1",
        "title":"Géographie"
    },
    {
        "id": "2",
        "title":"Histoire"
    },
    {
        "id": "3",
        "title":"Science"
    }
]

export default function UserPreferences() {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <ScreenWrapper scrollable >
            <Decoration radius={800} top={400} left={-500} />
            <View style={styles.container}>
                <Text style={globalStyles.title}>Bienvenue sur Repetika</Text>
                <Text style={globalStyles.subtitle}>Dis nous quels sujets t'intéressent</Text>
                <Text style={globalStyles.corpus}>Ces informations serviront à te proposer des cours selon tes centres d’intérêts.</Text>
                <FlatList data={} renderItem={}/>
            </View>
        </ScreenWrapper>
    )
}

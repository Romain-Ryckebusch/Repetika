import {View, Text, ScrollView, Image, TouchableOpacity, FlatList} from "react-native";
import globalStyles from '../../styles/global';


import ScreenWrapper from "../../components/navigation/screenWrapper";

import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';
import Decoration from "../../components/decoration";
import styles from "../../styles/userPreferences.style";
import {PlatformPressable} from "@react-navigation/elements";
import {useState} from "react";



const DATA = [
    {
        id: "1",
        title:" 🌍 Géographie"
    },
    {
        id: "2",
        title:" 🏛️ Histoire"
    },
    {
        id: "3",
        title:" 🔬 Science"
    },
    {
        id: "4",
        title: " 🇫🇷 France",
    },{
        "id": "5",
        title: " 🇪🇺 Europe"
    }
]




const Item = ({ title,id,onPress,isSelected }) => {
    return (
        <PlatformPressable style={[styles.item,isSelected?styles.itemPressed:null]} onPress={()=>onPress(id)}>
            <Text style={[styles.item.text,isSelected?styles.itemPressed.text:null]}>{title}</Text>
        </PlatformPressable>
    );
};



export default function UserPreferences() {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [itemsSelecteds, setItemsSelecteds] = useState([]);

    const handleSelect = (id) => {
        setItemsSelecteds((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    return (
        <ScreenWrapper scrollable >
            <Decoration radius={800} top={400} left={-500} />
            <View style={styles.container}>
                <Text style={globalStyles.title}>Bienvenue sur Repetika</Text>
                <Text style={globalStyles.subtitle}>Dis nous quels sujets t'intéressent</Text>
                <Text style={globalStyles.corpus}>Ces informations serviront à te proposer des cours selon tes centres d’intérêts.</Text>
                {DATA.map((item) => (
                    <Item key={item.id} title={item.title} id={item.id} onPress={handleSelect} isSelected={itemsSelecteds.includes(item.id)} />
                ))}
            </View>
        </ScreenWrapper>
    )
}

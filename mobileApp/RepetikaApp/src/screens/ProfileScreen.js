import { View, Text, ScrollView} from "react-native";
import globalStyles from '../styles/global';
import styles from '../styles/ProfileScreen.style';

import TrophyItem from "../components/trophy_item";
import ScreenWrapper from "../components/navigation/screenWrapper";

import { useTranslation } from "react-i18next";


export default function ProfileScreen() {
    const { t } = useTranslation();

    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
                
                    <Text style={globalStyles.title}>{t("profileScreen.title")}</Text>
                    
                    
                    <Text style={globalStyles.subtitle}>{t("profileScreen.section_trophies_title")}</Text>
                    <View style={styles.trophy_container}>
                        <View style={styles.trophy_row}>
                            <TrophyItem label="Apprenant" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                            <TrophyItem label="Thierry" unlocked={true} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                            <TrophyItem label="Fraise" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                            <TrophyItem label="Poulet" unlocked={true} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                        </View>
                        <View style={styles.shelf}></View>
                        <View style={styles.trophy_row}>
                            <TrophyItem label="Requin" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                            <TrophyItem label="Mayonnaise" unlocked={true} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                            <TrophyItem label="Turbo" unlocked={true} corpus="Vous vous êtes inscrit(e) sur Repetika." date="19/05/2025"/>
                            <TrophyItem label="Russie" unlocked={false} corpus="Vous n'êtes pas sensé lire ça. Si vous arrivez à le lire, contactez-moi, lol." date="21/05/2025"/>
                        </View>
                        <View style={styles.shelf}></View>
                    </View>


                    <Text style={globalStyles.subtitle}>{t("profileScreen.section_info_title")}</Text>
                    <View>
                    
                    </View>
                
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}


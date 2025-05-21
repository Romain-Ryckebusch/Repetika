import { View, StyleSheet, Text, TouchableOpacity, ScrollView} from "react-native";
import globalStyles from '../styles/global';
import colors from '../styles/colors';
import TrophyItem from "../components/trophy_item";
import ScreenWrapper from "../components/navigation/screenWrapper";

export default function ProfileScreen() {

    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">

                    <Text style={globalStyles.title}>Mon profil</Text>
                    <Text style={globalStyles.subtitle}>Trophées</Text>

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

                    <Text style={globalStyles.subtitle}>Informations générales</Text>
                    <View></View>

                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
  },
  trophy_container: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  trophy_row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shelf:{
    backgroundColor: colors.shelf,
    height: '8%',
    width: '95%',
    marginTop: -35, // chevauche un peu les trophées pour qu'ils "reposent" dessus
    zIndex: -1, // facultatif si tu veux qu’elle passe derrière
  }
});
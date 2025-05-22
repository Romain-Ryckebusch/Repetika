import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Button } from "react-native";

import globalStyles from '../styles/global';
import colors from '../styles/colors';
import styles from '../styles/SettingsScreen.style';
import Decoration from "../components/decoration";

import ScreenWrapper from "../components/navigation/screenWrapper";
import {useTranslation} from "react-i18next";

import { Picker } from '@react-native-picker/picker';

import Settings from '../utils/SettingsFunctions';

export default function StatisticsScreen() {

    const {t}=useTranslation();
    // Exemple de syntaxe pour utiliser la fonction de traduction ;
    // {t("homeScreen.splashMessage",{prenom:"Louis"})}

    // Exemple d'état en dur initialisé avec des valeurs quelconques
    const [settingsValues, setSettingsValues] = useState({
        "SettingsScreen.section1.param1": true,
        "SettingsScreen.section1.param2": false,
        "SettingsScreen.section1.param3": true,
        "SettingsScreen.section1.param4": false,
        "SettingsScreen.section1.param5": true,
        "SettingsScreen.section1.param6": false,
        "SettingsScreen.section1.param7": true,

        "SettingsScreen.section2.param1": "Français",  // choix
        "SettingsScreen.section2.param2": true,
        "SettingsScreen.section2.param3": false,
    });

    return (
    <View>
    <Decoration radius={900} top={-500} left={-600} />
    <ScreenWrapper scrollable>
        
        <View style={{ flex: 1 }}>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="always">

            <Text style={globalStyles.title}>{t("SettingsScreen.title")}</Text>

            {Settings.map((section, sectionIndex) => {
            const [titleRow, ...params] = section;

            return (
                <View key={`section-${sectionIndex}`} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.separator} />
                        <Text style={styles.sectionTitle}>{t(titleRow[0])}</Text>
                        <View style={styles.separator} />
                    </View>

                    {params.map(([key, type, callback, ...options], index) => (
                        <View key={key} style={styles.paramLine}>
                            <Text style={styles.subSectionTitle}>{t(key)}</Text>

                            {type === "boolean" && (
                                <Switch
                                trackColor={{ false: colors.grey, true: colors.primary }}
                                thumbColor={colors.white}
                                ios_backgroundColor={colors.grey}
                                onValueChange={(newValue) => {
                                    setSettingsValues(prev => ({ ...prev, [key]: newValue }));
                                    if (callback) callback(newValue);
                                }}
                                value={settingsValues[key] || false}
                                style={{ marginLeft: 'auto' }}
                                />
                            )}

                            {type === "choice" && (
                                <Picker
                                    selectedValue={settingsValues[key] || options[0]}
                                    style={{ width: 150 }}
                                    onValueChange={(itemValue) => {
                                        setSettingsValues(prev => ({ ...prev, [key]: itemValue }));
                                        if (callback) callback(itemValue);
                                    }}
                                >
                                    {options.map((option) => (
                                        <Picker.Item label={option} value={option} key={option} />
                                    ))}
                                </Picker>
                            )}
                        </View>
                    ))}
                </View>
            );
            })}


            <Text style={styles.credits} onPress={() => console.log("Si tu cliques ici 20 fois, tu obtiendrais un Trophée 'Easter Egg Seaker'.")}>
                Développé en 2025 par l’équipe PANØRAMA. {"\n"} Version 0.0.0
            </Text>    
        
        </ScrollView>
        </View>
    </ScreenWrapper>
    </View>
    );
};

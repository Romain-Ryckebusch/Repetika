import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importe les fichiers JSON de traduction
import fr from './locales/fr.json';
import en from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        // Langue initiale (locale détectée automatiquement)
        lng:  'en',


        // Fichiers de traduction
        resources: {
            fr: { translation: fr },
            en: { translation: en },
        },

        // Interpolation : pour insérer des variables ({{name}})
        interpolation: {
            escapeValue: false, // React s’occupe déjà d’échapper
        },

        // Détection automatique — sans plugin de détection (expo-localization suffit)
        compatibilityJSON: 'v3',
    });

export default i18n;

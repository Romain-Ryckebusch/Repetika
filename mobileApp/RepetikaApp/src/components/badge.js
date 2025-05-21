import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';


const Badge = ({ title, onPress, style, textStyle, selected }) => {
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) return null;

    return (
        <TouchableOpacity
            style={[styles.button, style, selected===true?styles.selected:null]}
            onPress={onPress}
            activeOpacity={0.8}

        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.lightGrey,
        paddingVertical:4,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: 'center',
        borderStyle: 'solid',
        alignSelf:'flex-start',
    },
    text: {
        color: colors.black,
        fontSize: 16,
        fontFamily: 'OpenSans_Regular',
    },
    selected: {
        backgroundColor: 'transparent',
        borderColor: colors.black,
        borderWidth: 1,
    },
});

export default Badge;

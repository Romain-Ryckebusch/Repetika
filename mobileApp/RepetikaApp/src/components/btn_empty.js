import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';


const Btn_Empty = ({ title, onPress, style, textStyle, disabled }) => {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: colors.primary,
    borderStyle: 'solid',
    borderWidth: 4,
    width: '100%',
  },
  text: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'OpenSans_Regular',
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
});

export default Btn_Empty;

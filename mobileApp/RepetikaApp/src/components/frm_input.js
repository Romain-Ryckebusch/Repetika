import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';
import globalStyles from '../styles/global';

const Input = ({ placeholder, value, onChangeText, secureTextEntry, style, maxLength,multiline = false,numberOfLines = 1 }) => {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        value={value}
        maxLength={maxLength}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={globalStyles.input}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: colors.primary,
    borderWidth: 1,
    width: '100%',
  },
  label: {
    color: colors.darkGray,
    fontSize: 14,
    fontFamily: 'OpenSans_Regular',
    marginBottom: 4,
    textAlign: 'left',
  },
  textInput: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'left',
  },
});

export default Input;

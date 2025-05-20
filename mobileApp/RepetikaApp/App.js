// App.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useGlobalFonts } from './src/styles/globalFonts';
import globalStyles from './src/styles/global';
import colors from './src/styles/colors';

import Btn_fill from './src/components/btn_fill';
import Btn_empty from './src/components/btn_empty';
import Input from './src/components/frm_input';

export default function App() {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>

      <Input placeholder="Entrez votre nom..." maxLength={20}/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

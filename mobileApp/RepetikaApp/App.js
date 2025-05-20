// App.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useGlobalFonts } from './src/styles/globalFonts';
import Btn_fill from './src/components/btn_fill';
import Btn_empty from './src/components/btn_empty';
import globalStyles from './src/styles/global';
import colors from './src/styles/colors';

export default function App() {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>

      <Text style={globalStyles.title}>Titre</Text>
      <Text style={globalStyles.subtitle}>Sous-titre</Text>

      <Text style={globalStyles.chapter}>Chapitre</Text>

      <Text style={globalStyles.corpus}>
        Aenean leo lacus, dictum at efficitur at, semper cursus nisl.
        Pellentesque et urna mi. Maecenas mollis arcu id eleifend tempor.
      </Text>

      <Text style={globalStyles.section}>Section</Text>
      
      <Text style={globalStyles.corpus}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id venenatis tellus. 
      </Text>

      <Btn_fill title="S'inscrire" onPress={() => console.log('cliqué')}/>
      <Btn_empty title="S'inscrire" onPress={() => console.log('cliqué')}/>

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

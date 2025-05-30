import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useGlobalFonts } from '../styles/globalFonts';
import globalStyles from '../styles/global';

const Crd_trophy = ({ title, corpus, date}) => {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <TouchableOpacity style={globalStyles.card}>
      <Text style={globalStyles.card_title}>{title}</Text>
      <Text style={globalStyles.card_corpus}>{corpus}</Text>
      <Text style={globalStyles.card_date}>Obtenu le {date}.</Text>
    </TouchableOpacity>
  );
};

export default Crd_trophy;

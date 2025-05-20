import { TouchableOpacity, Text, StyleSheet, View, Pressable } from 'react-native';

import { useGlobalFonts } from '../styles/globalFonts';
import globalStyles from '../styles/global';
import colors from '../styles/colors';


const Crd_confirm = ({

    title, corpus, 
    btn1_text, btn1_function, btn1_style, 
    btn2_text, btn2_function, btn2_style

}) => {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.card_title}>{title}</Text>
      <Text style={globalStyles.card_corpus}>{corpus}</Text>
      
      <View style={styles.container}>
        
        <Pressable style={[globalStyles.btn_confimrbox, btn1_style]} onPress={btn1_function}>
            <Text style={styles.btn_text}>{btn1_text}</Text>
        </Pressable>
        
        <Pressable style={[globalStyles.btn_confimrbox, btn2_style]} onPress={btn2_function}>
            <Text style={styles.btn_text}>{btn2_text}</Text>
        </Pressable>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:10,
    alignItems: 'center',
    top:10
  },
  btn_text:{
    fontFamily: 'OpenSans_Regular',
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default Crd_confirm;

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

import colors from '../styles/colors';
import globalStyles from '../styles/global';

const Crd_lesson = ({ title, corpus, crd_number, progress, onPress}) => {

  return (
    <TouchableOpacity style={globalStyles.card} onPress={onPress}>
      <Text style={globalStyles.card_title}>{title}</Text>
      <Text style={globalStyles.card_corpus}>{corpus}</Text>
      <Text style={globalStyles.card_due}>Cartes à revoir aujourd'hui : <Text style={{ color: '#ff7e7e' }}>{crd_number}</Text></Text>
      <Progress.Bar 
        style={globalStyles.card_progressbar}    
        height={15}
        color="#0dc800"
        unfilledColor="#d9d9d9"
        borderWidth={0}
        progress={progress/100}
        width={321}
      />
    </TouchableOpacity>
  );
};

export default Crd_lesson;

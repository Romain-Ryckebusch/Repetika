import { TouchableOpacity, Text } from 'react-native';
import * as Progress from 'react-native-progress';

import colors from '../styles/colors';
import globalStyles from '../styles/global';
import {useTranslation} from "react-i18next";


const Crd_lesson = ({ title, corpus, crd_number, progress, onPress}) => {
  const {t}=useTranslation();

  return (
      <TouchableOpacity style={[globalStyles.card, globalStyles.card_lesson,globalStyles.shadowDefault]} onPress={onPress}>
        <Text style={globalStyles.card_title}>{title}</Text>
        <Text style={globalStyles.card_corpus}>{corpus}</Text>
        <Text style={globalStyles.card_due}>
          {t("crd_lesson.dueLabel")} <Text style={{ color: '#ff7e7e' }}>{crd_number}</Text>
        </Text>
        <Progress.Bar 
          style={globalStyles.card_progressbar}
          height={15}
          color="#0dc800"
          unfilledColor="#d9d9d9"
          borderWidth={0}
          progress={progress / 100}
          width={321}
        />
      </TouchableOpacity>
  );
};

export default Crd_lesson;

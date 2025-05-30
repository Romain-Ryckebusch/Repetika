import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   





const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '5%',
  },
  subtitle:{
    ...globalStyles.subtitle,
    fontSize: 15,
  },

  generalInfo_name: {
    ...globalStyles.corpus,
    fontSize: 14,
    padding:0,
  },





    editableInfos_Form:{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 20,
  },

  saveBtn:{
      width: '100%',
      margin:30,
      alignSelf: 'center',

  },
  text: {
    ...globalStyles.corpus,
    fontSize: 14,
    textAlign: 'center',
    color: colors.grey,
    padding:3,

  },
  link: {
    textDecorationLine: 'underline',
  },

  login: {

    justifyContent: 'center', 
    alignItems: 'center',     

    
  },

});






export default styles

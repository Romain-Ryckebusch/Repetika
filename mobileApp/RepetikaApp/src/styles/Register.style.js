import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   





const styles = StyleSheet.create({
    container: {
      padding:5,
  },

  generalInfo_name: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans_Regular',
  },





    editableInfos_Form:{
      
      alignItems: 'center',     
      fontSize: 20,
      width: '90%',
      alignSelf: 'center',
      marginTop: 20,
  },

  saveBtn:{
      width: '50%',
      margin:30,
      alignSelf: 'center',

  },
  text: {
    fontSize: 16,
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

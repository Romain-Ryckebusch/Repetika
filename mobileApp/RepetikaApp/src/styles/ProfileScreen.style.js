import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   

const styles = StyleSheet.create({

  container: {
    padding:5,
  },
  
  // ---------- Section trophées ------------------------------------------
  trophy_container: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  trophy_row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shelf:{
    backgroundColor: colors.shelf,
    height: '20',
    width: '95%',
    marginTop: -35,
    zIndex: -1,
  },


  // ---------- Section infos générales ------------------------------------
  generalInfo_container: {
    flexDirection: 'row',
    gap:20,
    alignItems: 'center',
    alignSelf: 'center',
  },

  profilePicture:{
    height: 130,
    width: 130,
  },

  generalInfo_Right:{
    flexDirection: 'column',
  },

  generalInfo_name: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans_Regular',
  },
  generalInfo_accountCreation: {
    fontFamily: 'OpenSans_Regular',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Je récupère ça depuis les fichiers d'Aymeric. Merci le sang !
  levelSection:{
      width: '60%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
  },
  streakSection:{
      width: '20%',
      flexDirection: 'row',
      alignItems: 'center',
      fontWeight: 'bold',
  },
  streakIcon:{
      width: 16,
      height: 16,
  },
  streakText:{
      fontWeight: 'bold',
      fontSize: 20,
  },
  
  editPictureBtn:{
      backgroundColor: colors.primary,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      width: '80%',
    },
  editPictureBtnText:{
      color: colors.white,
      fontSize: 14,
      fontFamily: 'OpenSans_Regular',
  },

  // ------- Section infos utilisateur (qu'il peut modifier) ---------------
  editableInfos_Form:{
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

});

export default styles


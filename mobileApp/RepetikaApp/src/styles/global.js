import colors from './colors';

const globalStyles = {

  title: {
    fontFamily: 'KronaOne_Regular',
    fontSize: 41,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },

  subtitle: {
    fontFamily: 'KronaOne_Regular',
    fontSize: 31,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },

  corpus: {
    fontFamily: 'OpenSans_Regular',
    fontSize: 20,
    color: colors.text,
    textAlign: 'justify',
    width: '100%',
    padding: 30,
  },

  chapter:{
    fontFamily: 'KronaOne_Regular',
    fontSize: 31,
    color: colors.black,
    fontWeight: 'bold',
    textAlign:'left',
    width: '100%',
    left: 30,
    top:20,
    bottom: 10,
  },
  section:{
    fontFamily: 'KronaOne_Regular',
    fontSize: 25,
    color: colors.black,
    fontWeight: 'bold',
    textAlign:'left',
    width: '100%',
    left: 30,

    top:20,
    bottom: 10,
  },

  // ---------------------------------------------------------------------
  // ------ BUTTONS & INPUTS STYLES --------------------------------------

  input:{
    fontFamily: 'OpenSans_Regular',
    fontSize: 15,
    textAlign: 'left',
    width: '100%',
  },

  // ---------------------------------------------------------------------
  // --------- CARDS STYLES ----------------------------------------------

  card:{
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '93%',
    
  },
  card_title: {
    fontFamily: 'KronaOne_Regular',
    fontSize: 23,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    padding:10,
  },
  card_corpus: {
    fontFamily: 'OpenSans_Regular',
    fontSize: 16,
    color: colors.white,
    textAlign: 'justify',
    width: '94%',
  },
  card_date: {
    fontFamily: 'OpenSans_Bold',
    fontSize: 17,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
    padding:10,
  },
  card_progressbar: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20
  },
  card_due: {
    fontFamily: 'KronaOne_Regular',
    fontSize: 13,
    color: colors.white,
    textAlign: 'right',
    width: '100%',
    padding:10,
  },

  // ---------------------------------------------------------------------
  // --------- CONFIRM BOX STYLES ----------------------------------------

  btn_confimrbox:{
    color: colors.white,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    paddingVertical: 5,
    marginBottom: 12,  // 
  },
  btn_confimrbox_neutral:{
    backgroundColor: 'transparent',
  },
  btn_confimrbox_alert:{
    backgroundColor: '#dc3f3f',
  },

  // ---------------------------------------------------------------------
  // ------------- OVERLAY STYLES ----------------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // assombrissement
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

};

export default globalStyles;

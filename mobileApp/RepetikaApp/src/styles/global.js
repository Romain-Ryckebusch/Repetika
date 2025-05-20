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
    left: 30,
    top:20,
    bottom: 10,
  },
  input:{
    fontFamily: 'OpenSans_Regular',
    fontSize: 15,
    textAlign: 'left',
    width: '100%',
  }
};

export default globalStyles;

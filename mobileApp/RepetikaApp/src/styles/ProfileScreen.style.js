import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
  },
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
    height: '8%',
    width: '95%',
    marginTop: -35,
    zIndex: -1,
  },
});

export default styles


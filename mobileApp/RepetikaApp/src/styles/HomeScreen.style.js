import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 40,
  },
  Crd_container: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    fontSize: 21,
    padding: 10,
    paddingTop: 30,
  },
  addCard: {
    width: '93%',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dotted',
    borderWidth: 3,
    borderColor: colors.grey,
    height: 180,
    },
});

export default styles


import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';

const Btn_Fill = ({ title, onPress, style, textStyle, disabled }) => {
  const fontsLoaded = useGlobalFonts();
  if (!fontsLoaded) return null;

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'OpenSans_Regular',
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
});

export default Btn_Fill;

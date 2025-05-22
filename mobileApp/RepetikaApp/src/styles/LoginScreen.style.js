import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   

const styles = StyleSheet.create({

    container:{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    subtitle:{
        ...globalStyles.subtitle,
        fontSize: 15,
    },

    inputContainer: {
        width: '100%',
    },

    label:{
        ...globalStyles.corpus,
        fontSize: 14,
        padding:0,
    },

    credits:{
        ...globalStyles.corpus,
        fontSize: 12,
        textAlign: 'center',
        color: colors.grey,
    },

    ask_label:{
        ...globalStyles.corpus,
        fontSize: 14,
        textAlign: 'center',
        color: colors.grey,
        marginTop: 20,
    }

});

export default styles;
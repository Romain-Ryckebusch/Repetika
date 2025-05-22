import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   

const styles = StyleSheet.create({

    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    subtitle:{
        ...globalStyles.subtitle,
        fontSize: 15,
    },
    
    inputContainer:{
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },

    inputContainerLefter: {
        width: '100%',
        alignItems: 'flex-start',
    },


    label:{
        ...globalStyles.corpus,
        fontSize: 14,
        padding:0,
    },

    label_error:{
        color: colors.red,
        alignSelf: 'center',
        
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
        padding:3,
        textDecorationLine: 'underline',
    }

});

export default styles;
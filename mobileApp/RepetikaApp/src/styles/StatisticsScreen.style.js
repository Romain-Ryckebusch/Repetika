import { StyleSheet } from 'react-native';
import globalStyles from "../styles/global";


const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignContent: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },

    barChart:{
        marginVertical: 8,
        borderRadius: 16,
        alignSelf: 'center'
    },

    infos: {
        ...globalStyles.corpus,
        fontFamily: 'OpenSans_Regular',
        fontSize: 20,
        textAlign: 'center',
        width: '100%',
        padding: 0,
    },

})

export default styles;
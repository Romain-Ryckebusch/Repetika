import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';   

const styles = StyleSheet.create({

    sectionHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },

    separator:{
        height: 2,
        width: '90%',
        backgroundColor: colors.grey,
    },


    sectionTitle: {
        ...globalStyles.subtitle,
        textAlign: 'left',
        marginVertical: 10,
        paddingLeft: 30,
    },

    subSectionTitle:{
        flex: 1,
        ...globalStyles.corpus,
        fontSize: 15,
        textAlign: 'left',
        paddingLeft: 30,
        padding:0,
    },

    paramLine:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 3,
    },

    credits:{
        ...globalStyles.corpus,
        fontSize: 12,
        textAlign: 'center',
        color: colors.grey,
    }

});

export default styles;
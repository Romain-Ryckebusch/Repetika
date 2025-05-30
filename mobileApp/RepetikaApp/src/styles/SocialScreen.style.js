import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginLeft:'5%',
    },
    BoxScopeChoices:{
        marginTop:16,
        marginBottom:8,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius:16,
        justifyContent:'space-evenly',
    },
    boxScopeChoice:{
        width:'48%',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius:12,
        margin:4,
        text:{
            fontSize:16,
            padding:8,
        }
    },
    boxScopeSelected:{
        backgroundColor:colors.primary,
        text:{
            color:colors.white,
        }
    },
    filtersView:{
        width:'100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
    },
    classementView:{
        marginTop:16,
    },


    modal:{
        height: '800',
    },

    modalTitle:{
        ...globalStyles.title,
        color: colors.white,
        fontSize: 24,
        marginTop: 16,
    },

    modalSearchLabel:{
        fontFamily: 'OpenSans_Regular',
        fontSize: 15,
        color: colors.white,
        textAlign: 'left',
        width: '100%',
        marginTop: 16,
        marginBottom: 3,
    },

    closeBtn:{
        marginTop:16,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.white,

    }


})

export default styles;
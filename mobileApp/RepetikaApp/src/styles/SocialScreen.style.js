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
    }



})

export default styles;
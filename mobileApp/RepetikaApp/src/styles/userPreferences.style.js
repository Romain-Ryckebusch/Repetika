import { StyleSheet } from 'react-native';
import colors from './colors';
import globalStyles from './global';





const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingTop:'16%'
    },
    item:{
        marginTop:'7%',
        width:'80%',
        borderWidth:1,
        padding:16,
        borderColor:colors.primary,
        borderRadius:8,
        text:{
            fontSize:20,
            fontFamily:'KronaOne_Regular',

        }
    },
    itemPressed:{
        backgroundColor:colors.primary,
        text:{
            color:'white',
        }
    }


});






export default styles

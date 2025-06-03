import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    container: {
        paddingTop:'10%',
        flex:1,
        paddingHorizontal:'2%'
    },
    subtitle: {
        ...globalStyles.subtitle,
        textAlign: 'left',
        marginTop: 16,
    },inputContainer:{
        fontSize:22,
        fontFamily:"OpenSans_Regular",
        marginTop:16
    },

    joinedInputContainer:{
        joinedInputView:{
            flexDirection:'row',
            justifyContent:'flex-start',
            alignItems:'center',
            borderBottomColor:colors.primary,
            borderBottomWidth:1
        },
        label:{
            fontSize:24,
            fontFamily:'OpenSans_Regular',
        },
        cardInput:{
            width:'85%',
            color: colors.black,
            fontSize: 24,
            textAlign: 'left',

        },
    },
    chapterList:{
        marginTop:16,
        gap:16
    },
    card:{
        borderWidth:1,
        borderColor:colors.primary,
        borderStyle:'dashed',
        borderRadius:16,
        padding:8,
        paddingVertical:16,
        text:{
            fontFamily:'OpenSans_Regular',
            fontSize:16,
        }
    }



})

export default styles;
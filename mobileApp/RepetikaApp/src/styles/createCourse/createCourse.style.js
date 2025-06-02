import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    chapterBox:{
        borderWidth:1,
        borderColor:colors.primary,
        borderRadius:16,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        leftBox:{
            width:'70%',
            title:{
                fontSize:24,
                fontFamily:'OpenSans_Bold',
                marginBottom:8
            },
            btn:{
                paddingVertical:0,
                paddingHorizontal:8,
                width:'30%',
                marginBottom:8,
            }
        },
        rightBox:{
            paddingVertical:8,
            justifyContent:'space-between',
            alignItems:'flex-end',
            width:'20%',
            img:{
                width:20,
                height:20,
            }
        }
    },
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
    },
    btnView:{
        paddingVertical:16,
        paddingBottom:32,
        height:'20%',
        justifyContent:'space-evenly',
        backgroundColor:"#f2f2f2",
    }


})

export default styles;
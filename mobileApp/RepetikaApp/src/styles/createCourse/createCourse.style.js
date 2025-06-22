import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    backArrow:{
      width:40,
      height:40,
    },
    editPictureBtn:{
        backgroundColor: colors.primary,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
    },
    editPictureBtnText:{
        color: colors.white,
        fontSize: 14,
        fontFamily: 'OpenSans_Regular',
    },
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
    },
    chapterList:{
        marginTop:16,
        gap:16
    },
    addChapter:{
        width: '100%',
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dotted',
        borderWidth: 3,
        borderColor: colors.grey,
        height: 60,
    }


})

export default styles;
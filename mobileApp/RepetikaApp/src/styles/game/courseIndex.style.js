import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    header: {
        container: {
            height: '10%', // ← ici tu agrandis la hauteur
            paddingHorizontal: 16,
            marginTop:16,
            justifyContent: 'space-between', // ou 'space-between' selon ce que tu veux
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        headerTitle: {
            fontSize: 16,
            fontFamily: 'KronaOne_Regular'
        },
        backArrowBtn: {
            marginRight: 8
        },
        backArrowImg: {
            width: 24,
            height: 24
        },
        questionHeaderContainer: {
            width: '100%',
        },
        progressBar:{
            alignSelf:"center",
        },
    },
    container: {
        width: '90%',
        marginLeft:'5%',
    },
    BoxSectionChoices:{

        marginTop:16,
        marginBottom:8,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius:16,
        justifyContent:'space-evenly',
    },
    boxSectionChoice:{
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
    reviewPage:{
        view:{
            height:'100%',
            flexDirection:'column',
            justifyContent:'space-evenly',
            alignItems: 'center',
        },
        text:{
            fontSize:32,
            fontFamily:'OpenSans_Regular',
            textAlign:"center"
        },
        interactView:{
            width:'100%',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            text:{
                marginTop:16,
                textDecorationLine:'underline',
                fontSize:16,
                textAlign:'center',
            }
        }
    },
    coursePage:{
        view:{
            height:'100%',
            flexDirection:'row',
            justifyContent:'center',

            sideColumn:{
                width:'30%',
                zIndex:2
            },
            centerColumn:{
                position:'relative',
                width:'30%',
                flexDirection:'column',
                justifyContent:'space-around',
                alignItems:'center',
                zIndex:1,

                line: {
                    position:'relative',
                    height: 2,           // épaisseur du trait
                    borderBottomWidth: 6,
                    borderBottomColor: colors.grey,
                    borderStyle: 'dashed',  // ou 'dashed
                }
            }
        },
        chapterView: {
            backgroundColor:colors.primary,
            alignItems: 'center',
            justifyContent:'center',
            position:'relative',
            zIndex:10,
            title:{
                marginTop:8,
                fontSize:16,
                fontFamily:'OpenSans_Bold',
                color:colors.black,
                textAlign:'center',
            },
            icon:{
                width:80,
                height:80
            }
        }
    }


})

export default styles;
import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
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
                    borderBottomWidth: 2,
                    borderBottomColor: 'black',
                    borderStyle: 'dotted',  // ou 'dashed
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
                color:colors.black,
                textAlign:'center',
            }
        }
    }


})

export default styles;
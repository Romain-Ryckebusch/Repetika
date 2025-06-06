import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    streak:{
        number:{
            fontSize:96,
            color:colors.orange
        },
        list:{
            marginTop:'10%',
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            item: {
                alignItems: "center",
            },
            image:{
                width:55,
                height:55,
                animated:{
                    position:"absolute",
                }
            },
            text:{
                textAlign:"center",
            }
        },
        btn:{
            width: '80%',
            share:{
                marginTop:'5%',
            }
        }
    },
    trophy:{
        textView:{
            width:'90%',
        },
        trophyName:{
            textAlign:"center",
            fontSize:48,
            color:colors.orange,
            fontFamily: 'KronaOne_Regular',
        },
        imageView:{
            width:'90%',
            flexDirection:'column',
            alignItems:"center",
        },
        image:{
            width:200,
            height:200,
        },
        description:{
            fontSize:32,
            textAlign:"center",
        },
        buttonsView:{
            width: '80%',
        }
    },
    xp:{
        container: {
            width: "80%",
            alignSelf: "center",
            flexDirection: "column",
        },
        titleLevel:{
            color:colors.orange,
        },
        xpAddedNumber:{
            textAlign:"center",
            fontFamily:'KronaOne_Regular',
            fontSize:24,
            color:colors.orange,
        },
        progressView:{
            width:'100%',
            flexDirection:'row',
            alignItems:"center",
            justifyContent:"space-evenly",
        },
        levelNumber:{
            fontSize:32,
            fontFamily:'KronaOne_Regular',
        }
    }
})

export default styles;
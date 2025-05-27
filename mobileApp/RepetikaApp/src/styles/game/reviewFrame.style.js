
import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    header: {
        container: {
            height: '10%',
            paddingHorizontal: 16,
            marginTop:16,
            justifyContent: 'space-between',
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
        flex: 1,
        backgroundColor: colors.background,
        height: '100%',
    },
    questionView:{
        width: '80%',
        marginLeft:'10%',
        height: '80%',
        justifyContent: 'space-between',
        interactives:{
            input:{
                marginBottom:16
            }
        }
    },
    answerViewToaster:{
        backgroundColor: "#F4F4F4",
        width: '100%',
        position:"absolute",
        bottom:0,
        height:"20%",
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
        paddingTop:16,
        correctAnswerText:{
            fontSize:22,
            fontFamily:'OpenSans_Regular',
            textAlign:"center",
        },
        userAnswerText:{
            fontSize:16,
            fontFamily:'OpenSans_Regular',
            textAlign:"center",
        },
        interactives: {
            marginTop:16,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            buttons: {
                width: '40%',
            },
            correctButton: {
                backgroundColor: colors.green,
            },
            wrongButton: {
                backgroundColor: colors.wrongRed,
            }
        }
    },
    finishedSession:{

        flex:1,
        height:"100%",
        justifyContent:"center",
        splashText:{
            color:colors.primary,
        }
    }

})

export default styles;
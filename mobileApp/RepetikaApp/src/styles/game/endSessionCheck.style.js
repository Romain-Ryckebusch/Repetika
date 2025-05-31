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
    }
})

export default styles;
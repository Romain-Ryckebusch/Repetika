import { StyleSheet } from 'react-native';
import colors from '../colors';
import globalStyles from '../global';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
        }
    }
})

export default styles;
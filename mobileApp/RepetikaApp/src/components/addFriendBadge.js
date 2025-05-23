import { Text, StyleSheet, View, Image} from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';


const AddFriendBadge = ({ title, onPress, style, textStyle, selected }) => {
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>

            <Image style={styles.profilePicture} source={require("../assets/Profile.png")} />
            <Text style={styles.nameView}>BobyArkos275</Text>
            <Image style={styles.addIcon} source={require("../assets/icons/add_friend.png")} />

        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        width: '100%',
        backgroundColor:colors.darkGray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius:8,
        padding:8,
        marginTop:4,
    },

    profilePicture:{
        width:42,
        height:42,
        marginRight:8,
    },
    nameView:{
        fontSize: 16,
        color:colors.white,
        fontFamily: 'KronaOne_Regular',
    },
    addIcon:{
        width:24,
        height:24,
        marginLeft:'auto',
        marginRight:8
    }


});

export default AddFriendBadge;

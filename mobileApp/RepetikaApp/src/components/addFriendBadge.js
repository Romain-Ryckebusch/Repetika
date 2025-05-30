import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, Pressable} from 'react-native';
import colors from '../styles/colors';
import { useGlobalFonts } from '../styles/globalFonts';

const AddFriendBadge = ({ id, username, user_picture, onPress, style, textStyle, selected }) => {
    const fontsLoaded = useGlobalFonts();
    const [isAdded, setIsAdded] = useState(false);

    if (!fontsLoaded) return null;

    function addFriendEvent() {
        setIsAdded(true);
        console.log("add friend : ID = " + id);
        if (onPress) onPress(id);
    }

    return (
        <View style={[styles.container, style]}>

            <Image style={styles.profilePicture} source={user_picture} />
            <View style={styles.nameView}>
            <Text style={styles.nameText}>{username}</Text>
            </View>
            <Pressable style={{flex:1}} onPress={() => addFriendEvent()} >
                <Image 
                    style={styles.addIcon} 
                    source={
                            isAdded
                                ? require("../assets/icons/check.png")
                                : require("../assets/icons/add_friend.png")
                        }
                />
            </Pressable>
            
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
        overflow:"scroll",
        maxWidth: '60%',
    },
    
    nameText:{
        fontSize: 12,
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

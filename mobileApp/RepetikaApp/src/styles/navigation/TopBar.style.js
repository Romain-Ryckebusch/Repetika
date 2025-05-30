
import {StyleSheet} from 'react-native';
import colors from "../colors";
export default StyleSheet.create({
        container: {
            height: 100, // ← ici tu agrandis la hauteur
            paddingHorizontal: 16,
            paddingTop: 20, // un peu d’espace en haut
            justifyContent: 'space-between', // ou 'space-between' selon ce que tu veux
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        levelSection:{
            width: '60%',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        progressBar:{
            alignSelf:"center",
        },
        circle: {
            width: 20,
            height: 20,
            borderRadius: 10, // moitié de width/height
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
        },
        streakSection:{
            width: '20%',
            flexDirection: 'row',
            alignItems: 'center',
            fontWeight: 'bold',
        },
        streakIcon:{
            width: 16,
            height: 16,
        },
        streakText:{
            fontWeight: 'bold',
            fontSize: 20,
        },
        profilePictureButton:{
            width: '20%',
        },
        profilePictureImage:{
            width: 48,
            height: 48,
        },
        headerTitle:{
            fontSize: 16,
            fontFamily: 'KronaOne_Regular'
        },
        backArrowBtn:{
            marginRight:8
        },
        backArrowImg:{
            width: 24,
            height: 24
        },
        questionHeaderContainer:{
            width: '100%',
        }


}
);


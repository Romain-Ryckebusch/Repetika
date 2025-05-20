
import {Platform, StyleSheet} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import './colors'
import colors from "./colors";
export default StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical:8,
        paddingHorizontal:'10%',
        height: 60,
        width: '90%',
        marginHorizontal:'5%',
        marginVertical:'10%',
        borderRadius:64,
        overflow: 'visible' // autorise l’ombre à dépasser
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        paddingVertical: 8,
        flex: 1,
        backgroundColor:colors.primary,
    },
    tabButtonFocused:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -15,
        marginBottom: -15,
        backgroundColor:colors.primary,
        borderRadius:8,
        paddingHorizontal:16,
        zIndex:10

    },
    navBarIcon:{
        width: 32,
        height: 32,
        padding: 8
    },
    navBarIconFocused:{
        width: 32,
        height: 32,
        padding: 8
    },
    tabText: {
        color: colors.white,
    },
    tabTextFocused: {
        color:colors.white,
        fontWeight: 'bold',
    },
});

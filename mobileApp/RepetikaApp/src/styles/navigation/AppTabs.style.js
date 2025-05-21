
import {StyleSheet} from 'react-native';
import '../colors'
import colors from "../colors";
export default StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: '10%',
        height: 60,
        borderRadius: 64,
        overflow: 'visible',
        width: '90%',
        marginHorizontal: 0,
        marginVertical: 0,
        position: 'absolute',
        bottom: 32,
        left: '5%',
        right: 0,
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
        fontFamily: 'OpenSans_Regular',
    },
    tabTextFocused: {
        color:colors.white,
        fontWeight: 'bold',
        fontFamily: 'OpenSans_Regular',
    },
});


import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#991CCA',
        marginBottom: '10%',
        marginLeft: '10%',
        width:'80%',
        borderRadius:16
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    navBarIcon:{
        width: 32,
        height: 32,
    },
    tabText: {
        color: 'white',
    },
    tabTextFocused: {
        color:'white',
        fontWeight: 'bold',
    },
});

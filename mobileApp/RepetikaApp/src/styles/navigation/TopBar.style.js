
import {Platform, StyleSheet} from 'react-native';
import '../colors'
import colors from "../colors";
export default StyleSheet.create({
        container: {
            height: Platform.OS === 'ios' ? 100 : 80,
            paddingTop: Platform.OS === 'ios' ? 50 : 30,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4, // Android shadow
            shadowColor: '#000', // iOS shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            flex:1,
            flexDirection:'row'
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
        },
}
);
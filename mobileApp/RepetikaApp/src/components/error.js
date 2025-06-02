import { View, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

const ErrorView = ({ visibility, text, importance }) => {
    if (visibility) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{text}</Text>
            </View>
        );
    } else {
        return null;
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.orange,
        padding: 10,
        borderRadius: 8,
        width: '95%',
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontFamily: 'OpenSans_Regular',
    },
});

export default ErrorView;

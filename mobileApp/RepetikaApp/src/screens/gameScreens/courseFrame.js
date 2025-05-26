import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CourseFrame() {
    const pdfUrl = "https://aymeric-droulers.github.io/ISEN3_24-25_Lancement-PFA3.pdf"
    const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=`+pdfUrl;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: viewerUrl}}
                style={{ flex: 1 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

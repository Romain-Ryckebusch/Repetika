import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, scrollable = true, padding=true, style }) => {
    const insets = useSafeAreaInsets(); // prend en compte l'encoche, la barre de navigation iOS, etc.

    const bottomPadding = insets.bottom + 80; // 80 = hauteur estimée de ta tab bar personnalisée

    if (scrollable) {
        return (
            <ScrollView
                contentContainerStyle={[style, { paddingBottom: padding?bottomPadding:0, flexGrow: 1 }]}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom:padding?bottomPadding:0 }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenWrapper;

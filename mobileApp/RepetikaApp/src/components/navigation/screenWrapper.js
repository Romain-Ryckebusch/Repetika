import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ children, scrollable = true }) => {
    const insets = useSafeAreaInsets(); // prend en compte l'encoche, la barre de navigation iOS, etc.

    const bottomPadding = insets.bottom + 80; // 80 = hauteur estimée de ta tab bar personnalisée

    if (scrollable) {
        return (
            <ScrollView
                contentContainerStyle={{ paddingBottom: bottomPadding, flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
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

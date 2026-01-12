import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface ScreenWrapperProps {
    children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
    const { colors, isDark } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ExpoStatusBar style={isDark ? 'light' : 'dark'} />
            <LinearGradient
                colors={isDark ? [colors.background, '#1e293b'] : [colors.background, '#e2e8f0']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <SafeAreaView style={styles.safeArea}>
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});

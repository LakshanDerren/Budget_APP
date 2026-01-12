import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface GlassContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    hasGradient?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
    children,
    style,
    intensity = 20,
    hasGradient = false
}) => {
    const { colors, isDark } = useAppTheme();

    return (
        <View style={[styles.wrapper, style]}>
            <BlurView intensity={intensity} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
            {hasGradient && (
                <LinearGradient
                    colors={[colors.glassBackground, isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.2)']}
                    style={StyleSheet.absoluteFill}
                />
            )}

            <View style={[styles.borderLayer, { borderColor: colors.glassBorder }]} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: 16,
    },
    borderLayer: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderRadius: 16,
    },
    content: {
        // padding: 16, // Let parent control padding via style
    }
});

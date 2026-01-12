import { StyleSheet } from 'react-native';

const DARK_COLORS = {
    background: '#0F172A', // Dark Slate Blue
    surface: 'rgba(30, 41, 59, 0.7)', // Slightly lighter for cards
    primaryStart: '#3B82F6', // Blue 500
    primaryEnd: '#14B8A6',   // Teal 500
    accent: '#F472B6', // Pink 400
    success: '#10B981',
    error: '#EF4444',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    tabBarBackground: 'rgba(15, 23, 42, 0.8)',
};

const LIGHT_COLORS = {
    background: '#F0F9FF', // Sky 50
    surface: 'rgba(255, 255, 255, 0.7)',
    primaryStart: '#2563EB', // Blue 600
    primaryEnd: '#0D9488',   // Teal 600
    accent: '#DB2777', // Pink 600
    success: '#059669', // Emerald 600
    error: '#DC2626', // Red 600
    text: '#1E293B', // Slate 800
    textSecondary: '#64748B', // Slate 500
    glassBorder: 'rgba(15, 23, 42, 0.1)',
    glassBackground: 'rgba(255, 255, 255, 0.6)', // More opaque for light mode
    tabBarBackground: 'rgba(255, 255, 255, 0.8)',
};

export const COLORS = DARK_COLORS; // Default export for backwards compatibility if needed temporarily

export const THEMES = {
    dark: DARK_COLORS,
    light: LIGHT_COLORS,
};

export const GLASS_STYLES = StyleSheet.create({
    container: {
        borderWidth: 1,
        overflow: 'hidden',
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    }
});

export const Fonts = {
    rounded: 'System', // Placeholder
    mono: 'System',
};

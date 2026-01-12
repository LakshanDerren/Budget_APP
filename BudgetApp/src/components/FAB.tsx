import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface FABProps {
    onPress: () => void;
}

export const FAB: React.FC<FABProps> = ({ onPress }) => {
    const { colors } = useAppTheme();
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, { shadowColor: colors.primaryStart }]}>
            <LinearGradient
                colors={[colors.primaryStart, colors.primaryEnd]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

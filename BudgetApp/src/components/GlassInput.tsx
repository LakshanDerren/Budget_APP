import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { GlassContainer } from './GlassContainer';

interface GlassInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({ label, error, style, ...props }) => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
            <GlassContainer style={[styles.inputContainer, !!error && { borderColor: colors.error, borderWidth: 1 }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }, style]}
                    placeholderTextColor={colors.textSecondary}
                    selectionColor={colors.primaryStart}
                    {...props}
                />
            </GlassContainer>
            {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    inputContainer: {
        overflow: 'hidden',
        borderRadius: 12,
    },
    input: {
        padding: 16,
        fontSize: 16,
        width: '100%',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

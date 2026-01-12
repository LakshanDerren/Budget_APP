import { GlassContainer } from '@/src/components/GlassContainer';
import { GlassInput } from '@/src/components/GlassInput';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { updateProfile } from '@/src/store/slices/authSlice';
import { resetGoals } from '@/src/store/slices/goalsSlice';
import { setThemeMode } from '@/src/store/slices/settingsSlice';
import { resetWallet, setDailyLimitAsync } from '@/src/store/slices/walletSlice';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function SettingsScreen() {
    const dispatch = useDispatch();
    const { colors, themeMode, isDark } = useAppTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const { dailyLimit } = useSelector((state: RootState) => state.wallet);

    const [newName, setNewName] = useState(user?.name || '');
    const [newLimit, setNewLimit] = useState(dailyLimit.toString());

    // Theme Helpers
    const isSystem = themeMode === 'system';

    const handleSaveProfile = () => {
        if (newName.trim()) {
            dispatch(updateProfile({ name: newName }));
            Alert.alert('Success', 'Profile name updated');
        }
    };

    const handleSaveLimit = () => {
        const limit = Number(newLimit);
        if (!isNaN(limit) && limit > 0) {
            dispatch(setDailyLimitAsync({ limit }));
            Alert.alert('Success', 'Daily limit updated');
        } else {
            Alert.alert('Error', 'Please enter a valid amount');
        }
    };

    const handleResetData = () => {
        const resetAction = () => {
            dispatch(resetWallet());
            dispatch(resetGoals());
            if (Platform.OS === 'web') {
                window.alert('All data has been reset.');
            } else {
                Alert.alert('Success', 'All data has been reset.');
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to reset ALL data? This cannot be undone and will clear all transactions and goals.')) {
                resetAction();
            }
        } else {
            Alert.alert(
                'Danger Zone',
                'Are you sure you want to reset ALL data? This cannot be undone and will clear all transactions and goals.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Reset Everything', style: 'destructive', onPress: resetAction }
                ]
            );
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                </View>

                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
                    <GlassContainer style={styles.card}>
                        <View style={styles.row}>
                            <Text style={[styles.label, { color: colors.text }]}>Mode</Text>
                            <View style={[styles.toggleRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                <TouchableOpacity
                                    style={[styles.modeBtn, isSystem && { backgroundColor: colors.primaryStart }]}
                                    onPress={() => dispatch(setThemeMode('system'))}
                                >
                                    <Text style={[styles.modeText, { color: isSystem ? 'white' : colors.textSecondary }]}>Auto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modeBtn, themeMode === 'light' && { backgroundColor: colors.primaryStart }]}
                                    onPress={() => dispatch(setThemeMode('light'))}
                                >
                                    <Ionicons name="sunny" size={16} color={themeMode === 'light' ? 'white' : colors.textSecondary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modeBtn, themeMode === 'dark' && { backgroundColor: colors.primaryStart }]}
                                    onPress={() => dispatch(setThemeMode('dark'))}
                                >
                                    <Ionicons name="moon" size={16} color={themeMode === 'dark' ? 'white' : colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GlassContainer>
                </View>

                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Profile</Text>
                    <GlassContainer style={styles.card}>
                        <GlassInput
                            label="Display Name"
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Your Name"
                        />
                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                            onPress={handleSaveProfile}
                        >
                            <Text style={[styles.saveBtnText, { color: colors.text }]}>Update Name</Text>
                        </TouchableOpacity>
                    </GlassContainer>
                </View>

                {/* Budget Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Budget & Goals</Text>
                    <GlassContainer style={styles.card}>
                        <GlassInput
                            label="Daily Spending Limit"
                            value={newLimit}
                            onChangeText={setNewLimit}
                            keyboardType="numeric"
                            placeholder="2000"
                        />
                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                            onPress={handleSaveLimit}
                        >
                            <Text style={[styles.saveBtnText, { color: colors.text }]}>Update Limit</Text>
                        </TouchableOpacity>
                    </GlassContainer>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
                    <GlassContainer style={[styles.card, { borderColor: colors.error, borderWidth: 1 }]}>
                        <Text style={[styles.dangerText, { color: colors.text }]}>
                            Resetting takes you back to square one. Proceed with caution.
                        </Text>
                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: colors.error }]}
                            onPress={handleResetData}
                        >
                            <Text style={[styles.saveBtnText, { color: 'white' }]}>Reset All Data</Text>
                        </TouchableOpacity>
                    </GlassContainer>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>Pulse & Vault v1.0.0</Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for tab bar
    },
    header: {
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        padding: 20,
        borderRadius: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
    },
    toggleRow: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        gap: 4,
    },
    modeBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    saveBtn: {
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    saveBtnText: {
        fontWeight: '600',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 20,
    },
    dangerText: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
    }
});

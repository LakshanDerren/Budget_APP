import { GlassContainer } from '@/src/components/GlassContainer';
import { GlassInput } from '@/src/components/GlassInput';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { addTransactionAsync } from '@/src/store/slices/walletSlice';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function DepositScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { colors } = useAppTheme();
    const user = useSelector((state: RootState) => state.auth.user);

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    // For MVP, we'll default to 'pocket' but show buttons to toggle if we want, or just default to pocket.
    // Let's add simple toggle.
    const [walletType, setWalletType] = useState<'pocket' | 'vault'>('pocket');

    const handleSubmit = () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }

        const userId = user._id || user.name;

        dispatch(addTransactionAsync({
            userId,
            amount: Number(amount),
            type: 'deposit',
            wallet: walletType,
            note: note || undefined,
            category: 'Deposit'
        }) as any);

        router.back();
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Deposit</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <GlassContainer style={styles.formContainer}>

                        {/* Wallet Toggle */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                onPress={() => setWalletType('pocket')}
                                style={[styles.toggleButton, walletType === 'pocket' && styles.toggleActive, { borderColor: colors.success }]}
                            >
                                <Text style={[styles.toggleText, walletType === 'pocket' && styles.toggleTextActive, { color: walletType === 'pocket' ? 'white' : colors.textSecondary }]}>Pocket</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setWalletType('vault')}
                                style={[styles.toggleButton, walletType === 'vault' && styles.toggleActive, { borderColor: colors.primaryStart }]}
                            >
                                <Text style={[styles.toggleText, walletType === 'vault' && styles.toggleTextActive, { color: walletType === 'vault' ? 'white' : colors.textSecondary }]}>Vault</Text>
                            </TouchableOpacity>
                        </View>

                        <GlassInput
                            label="Amount"
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            style={[styles.amountInput, { color: walletType === 'pocket' ? colors.success : colors.primaryStart }]}
                        />

                        <GlassInput
                            label="Note (Optional)"
                            placeholder="Description..."
                            value={note}
                            onChangeText={setNote}
                            multiline
                            numberOfLines={3}
                            style={{ height: 80, textAlignVertical: 'top' }}
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSubmit}
                            style={[styles.submitButton, { backgroundColor: walletType === 'pocket' ? colors.success : colors.primaryStart }]}
                        >
                            <Text style={styles.submitButtonText}>Confirm Deposit</Text>
                        </TouchableOpacity>
                    </GlassContainer>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    formContainer: {
        padding: 20,
        borderRadius: 24,
    },
    amountInput: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    submitButton: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    toggleActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    toggleText: {
        fontWeight: '600',
    },
    toggleTextActive: {
        fontWeight: 'bold',
    }
});

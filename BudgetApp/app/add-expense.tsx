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

export default function AddExpenseScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { colors } = useAppTheme();
    const user = useSelector((state: RootState) => state.auth.user);

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (!category) {
            Alert.alert('Error', 'Please enter a category');
            return;
        }

        if (!user || (!user._id && !user.name)) {
            Alert.alert('Error', 'User not identified');
            return;
        }

        // Use user._id if available, fallback to something else if offline logic persisted, but now we depend on backend.
        // Assuming user object has _id from Mongoose.
        const userId = user._id || user.name; // Fallback to name if _id via simulated login didn't persist well, but normally _id

        dispatch(addTransactionAsync({
            userId,
            amount: Number(amount),
            type: 'expense',
            wallet: 'pocket',
            category,
            note: note || undefined
        }) as any); // Type assertion might be needed if Thunk not fully typed in dispatch

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
                    <Text style={[styles.title, { color: colors.text }]}>Log Expense</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <GlassContainer style={styles.formContainer}>
                        <GlassInput
                            label="Amount"
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            style={[styles.amountInput, { color: colors.error }]}
                        />

                        <GlassInput
                            label="Category"
                            placeholder="e.g., Food, Transport"
                            value={category}
                            onChangeText={setCategory}
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

                        <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: colors.error }]}>
                            <Text style={styles.submitButtonText}>Log Expense</Text>
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
});

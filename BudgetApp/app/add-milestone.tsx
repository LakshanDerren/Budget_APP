import { GlassContainer } from '@/src/components/GlassContainer';
import { GlassInput } from '@/src/components/GlassInput';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { addGoalAsync } from '@/src/store/slices/goalsSlice';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function AddMilestoneScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { colors } = useAppTheme();
    const user = useSelector((state: RootState) => state.auth.user);

    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = () => {
        if (!title) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        if (!targetAmount || isNaN(Number(targetAmount))) {
            Alert.alert('Error', 'Please enter a valid target amount');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }

        const userId = user._id || user.name;

        dispatch(addGoalAsync({
            userId,
            name: title,
            targetAmount: Number(targetAmount),
            deadline: deadline || undefined,
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
                    <Text style={[styles.title, { color: colors.text }]}>New Milestone</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <GlassContainer style={styles.formContainer}>
                        <GlassInput
                            label="Title"
                            placeholder="e.g., New Laptop, Vacation"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <GlassInput
                            label="Target Amount"
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={targetAmount}
                            onChangeText={setTargetAmount}
                            style={[styles.amountInput, { color: colors.primaryStart }]}
                        />

                        <GlassInput
                            label="Deadline (Optional)"
                            placeholder="YYYY-MM-DD"
                            value={deadline}
                            onChangeText={setDeadline}
                        />

                        <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: colors.primaryStart }]}>
                            <Text style={styles.submitButtonText}>Create Milestone</Text>
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

import { GlassContainer } from '@/src/components/GlassContainer';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { registerUser, updateProfile } from '@/src/store/slices/authSlice';
import { addTransactionAsync, setDailyLimitAsync } from '@/src/store/slices/walletSlice';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function OnboardingScreen() {
    const { colors } = useAppTheme();
    const { status, error: authError } = useSelector((state: RootState) => state.auth);
    const isLoading = status === 'loading';
    const [uiError, setUiError] = useState<string | null>(null);

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cash, setCash] = useState('');
    const [limit, setLimit] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleNext = async () => {
        console.log("Handle Next pressed. Step:", step);
        if (step === 1) {
            if (name && email && password) {
                try {
                    console.log("Dispatching registerUser...");
                    const resultAction = await dispatch(registerUser({ name, email, password }) as any);
                    console.log("Register Result:", resultAction);

                    if (registerUser.fulfilled.match(resultAction)) {
                        console.log("Registration succeeded");
                        setUiError(null);
                        setCurrentUser(resultAction.payload);
                        setStep(2);
                    } else {
                        console.error("Registration failed:", resultAction.error);
                        setUiError(resultAction.error.message || "Registration failed");
                    }
                } catch (err: any) {
                    console.error("Registration error catch:", err);
                    const status = err.response?.status;
                    const url = err.config?.url;
                    const message = err.message;
                    setUiError(`Error ${status}: ${message}\nURL: ${url}`);
                }
            } else {
                setUiError("Please fill in all fields.");
            }
        } else if (step === 2) {
            if (cash && limit && currentUser) {
                // Initial Calibration
                const initialCash = parseFloat(cash);
                const daily = parseFloat(limit);
                // userId is now inferred from token in backend, but we need to ensure token is set.
                // registerUser sets the token in storage.

                dispatch(addTransactionAsync({
                    amount: initialCash,
                    wallet: 'pocket',
                    type: 'deposit',
                    category: 'Initial Deposit',
                    note: 'Initial Cash'
                }) as any);

                dispatch(setDailyLimitAsync({ limit: daily }) as any);

                dispatch(updateProfile({ isOnboarded: true }) as any);

                router.replace('/(tabs)');
            }
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={[styles.stepText, { color: colors.primaryStart }]}>Step {step} of 2</Text>
                            <Text style={[styles.title, { color: colors.text }]}>{step === 1 ? 'Welcome to Pulse' : 'Calibration'}</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                {step === 1 ? "Let's create your secure account." : "Align your wallet with reality."}
                            </Text>
                        </View>

                        <GlassContainer style={styles.card} intensity={20}>
                            {step === 1 ? (
                                <View style={styles.form}>
                                    <Text style={[styles.label, { color: colors.text }]}>Name</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                                        placeholder="Your Name"
                                        placeholderTextColor={colors.textSecondary}
                                        value={name}
                                        onChangeText={setName}
                                    />

                                    <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                                        placeholder="john@example.com"
                                        placeholderTextColor={colors.textSecondary}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />

                                    <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                                        placeholder="********"
                                        placeholderTextColor={colors.textSecondary}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                </View>
                            ) : (
                                <View style={styles.form}>
                                    <Text style={[styles.label, { color: colors.text }]}>Total Cash in Wallet (Liquid)</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                                        placeholder="e.g. 5000"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="numeric"
                                        value={cash}
                                        onChangeText={setCash}
                                    />

                                    <View style={{ height: 20 }} />

                                    <Text style={[styles.label, { color: colors.text }]}>Daily Spending Limit</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.glassBorder }]}
                                        placeholder="e.g. 2000"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="numeric"
                                        value={limit}
                                        onChangeText={setLimit}
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.primaryStart, opacity: isLoading ? 0.7 : 1 }]}
                                onPress={handleNext}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>{step === 1 ? 'Next' : 'Launch Pulse 🚀'}</Text>
                                )}
                            </TouchableOpacity>

                            {/* Error Display */}
                            {(uiError || authError) && (
                                <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
                                    {uiError || authError}
                                </Text>
                            )}
                        </GlassContainer>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 40,
    },
    stepText: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 8,
    },
    card: {
        padding: 24,
    },
    form: {
        gap: 12,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

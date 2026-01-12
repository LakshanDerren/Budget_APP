
import { GlassContainer } from '@/src/components/GlassContainer';
import { GoalCard } from '@/src/components/GoalCard';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { deleteGoalAsync, Goal, reorderGoalsAsync, selectGoalsWithFunding } from '@/src/store/slices/goalsSlice';
import { addTransactionAsync } from '@/src/store/slices/walletSlice';
import { RootState } from '@/src/store/store';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function MilestonesScreen() {
    const { colors } = useAppTheme();
    const { vaultBalance } = useSelector((state: RootState) => state.wallet);
    const user = useSelector((state: RootState) => state.auth.user);
    const goalsWithFunding = useSelector((state: RootState) => selectGoalsWithFunding(state));

    const dispatch = useDispatch();

    const handleSimulateDeposit = () => {
        if (user) {
            const userId = user._id || user.name;
            dispatch(addTransactionAsync({
                userId,
                amount: 5000,
                wallet: 'vault',
                type: 'deposit',
                category: 'Demo',
                note: 'Demo Deposit'
            }) as any);
        }
    };

    const handleRedeem = (goal: Goal) => {
        if (!user) return;
        const userId = user._id || user.name;

        const confirmRedeem = () => {
            dispatch(addTransactionAsync({
                userId,
                amount: goal.savedAmount,
                type: 'expense',
                wallet: 'vault',
                category: 'Goal Redeemed',
                note: `Redeemed Goal: ${goal.name}`
            }) as any);
            dispatch(deleteGoalAsync(goal.id) as any);
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Are you sure you want to redeem "${goal.name}"? This will deduct LKR ${goal.savedAmount.toLocaleString()} from your Vault.`)) {
                confirmRedeem();
            }
        } else {
            Alert.alert(
                "Redeem Goal?",
                `Are you sure you want to redeem "${goal.name}"? This will deduct LKR ${goal.savedAmount.toLocaleString()} from your Vault.`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Done",
                        style: "destructive",
                        onPress: confirmRedeem
                    }
                ]
            );
        }
    };

    const handleRemove = (goal: Goal) => {
        const confirmRemove = () => {
            dispatch(deleteGoalAsync(goal.id) as any);
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Are you sure you want to remove "${goal.name}"? The saved amount (LKR ${goal.savedAmount.toLocaleString()}) will remain in your Vault for other goals.`)) {
                confirmRemove();
            }
        } else {
            Alert.alert(
                "Remove Goal?",
                `Are you sure you want to remove "${goal.name}"? The saved amount (LKR ${goal.savedAmount.toLocaleString()}) will remain in your Vault for other goals.`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Remove",
                        style: "destructive",
                        onPress: confirmRemove
                    }
                ]
            );
        }
    };

    const handleMoveUp = (goalId: string) => {
        dispatch(reorderGoalsAsync({ goalId, direction: 'up' }) as any);
    };

    const handleMoveDown = (goalId: string) => {
        dispatch(reorderGoalsAsync({ goalId, direction: 'down' }) as any);
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>The Vault</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Prioritized Goals</Text>
                </View>

                <GlassContainer style={styles.balanceCard} intensity={40} hasGradient>
                    <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Vault Balance</Text>
                    <Text style={[styles.balanceValue, { color: colors.text }]}>LKR {vaultBalance.toLocaleString()}</Text>
                    <TouchableOpacity onPress={handleSimulateDeposit}>
                        <Text style={[styles.demoLink, { color: colors.primaryStart }]}>+ Simulate Deposit (5k)</Text>
                    </TouchableOpacity>
                </GlassContainer>

                <View style={styles.goalsList}>
                    {goalsWithFunding.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No goals yet. Add one to start saving!</Text>
                        </View>
                    ) : (
                        goalsWithFunding.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                name={goal.name}
                                targetAmount={goal.targetAmount}
                                savedAmount={goal.savedAmount}
                                priority={goal.priority}
                                isActive={goal.savedAmount > 0 && goal.savedAmount < goal.targetAmount || (goal.savedAmount === goal.targetAmount && goal.savedAmount > 0)}
                                onRedeem={() => handleRedeem(goal)}
                                onRemove={() => handleRemove(goal)}
                                onMoveUp={() => handleMoveUp(goal.id)}
                                onMoveDown={() => handleMoveDown(goal.id)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
    },
    balanceCard: {
        marginHorizontal: 20,
        padding: 24,
        marginBottom: 30,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    demoLink: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    goalsList: {
        paddingHorizontal: 20,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontStyle: 'italic',
    }
});

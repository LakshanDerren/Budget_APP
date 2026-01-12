import { CircularGauge } from '@/src/components/CircularGauge';
import { GlassContainer } from '@/src/components/GlassContainer';
import { QuickTaps } from '@/src/components/QuickTaps';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { addTransactionAsync, selectQuickAddItems } from '@/src/store/slices/walletSlice';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function PulseScreen() {
  const { colors } = useAppTheme();
  const { pocketBalance, dailyLimit, spentToday } = useSelector((state: RootState) => state.wallet);
  const quickAddItems = useSelector(selectQuickAddItems);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const burnPercentage = Math.min((spentToday / dailyLimit) * 100, 100);
  const rawRemaining = dailyLimit - spentToday;
  const isOverspent = rawRemaining < 0;
  const displayAmount = Math.abs(rawRemaining);

  const handleQuickTap = (item: any) => {
    if (!user) return;
    const userId = user._id || user.name;
    dispatch(addTransactionAsync({
      userId,
      amount: item.amount || 500,
      type: 'expense',
      wallet: 'pocket',
      category: item.name,
      note: 'Quick Tap'
    }) as any);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>Daily Pulse</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}</Text>
        </View>

        <View style={styles.gaugeContainer}>
          <CircularGauge
            percentage={burnPercentage}
            label={`${displayAmount}`}
            subLabel={isOverspent ? "You're Overspent $ " : "Remaining Today $"}
            color={isOverspent || rawRemaining < dailyLimit * 0.2 ? colors.error : colors.primaryStart}
            trackColor={colors.glassBorder}
          />
        </View>

        <GlassContainer style={styles.statCard}>
          <View style={styles.statRow}>
            <View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pocket Balance</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>LKR {pocketBalance.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Limit</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>LKR {dailyLimit.toLocaleString()}</Text>
            </View>
          </View>
        </GlassContainer>

        <QuickTaps items={quickAddItems} onPress={handleQuickTap} />

        {/* Recent Transactions List could go here */}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // Space for FAB
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statCard: {
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  }
});

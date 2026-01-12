import { GlassContainer } from '@/src/components/GlassContainer';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { selectGoalsWithFunding } from '@/src/store/slices/goalsSlice';
import { Transaction } from '@/src/store/slices/walletSlice';
import { RootState } from '@/src/store/store';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

const screenWidth = Dimensions.get('window').width;

export default function InsightsScreen() {
    const { colors } = useAppTheme();
    const { transactions, vaultBalance, dailyLimit } = useSelector((state: RootState) => state.wallet);
    const goalsWithFunding = useSelector((state: RootState) => selectGoalsWithFunding(state));

    // 1. Prepare Data for Line Chart (Last 7 days spending)
    const getLast7Days = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d);
        }
        return dates;
    };

    const last7Days = getLast7Days();
    const labels = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));

    const calculateDailySpend = () => {
        const dailyTotals = new Array(7).fill(0);

        transactions.filter((t: Transaction) => t.type === 'expense' && t.wallet === 'pocket').forEach((t: Transaction) => {
            const tDate = new Date(t.date);
            // Check if transaction date matches any of our last 7 days
            last7Days.forEach((day, index) => {
                if (tDate.getDate() === day.getDate() &&
                    tDate.getMonth() === day.getMonth() &&
                    tDate.getFullYear() === day.getFullYear()) {
                    dailyTotals[index] += t.amount;
                }
            });
        });
        return dailyTotals;
    };

    const spentData = calculateDailySpend();

    const lineChartData = {
        labels: labels,
        datasets: [
            {
                data: spentData,
                color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`, // Teal
                strokeWidth: 2,
            },
            {
                data: new Array(7).fill(dailyLimit), // Budget Line
                color: (opacity = 1) => colors.textSecondary, // Use theme color
                withDots: false,
            }
        ],
        legend: ['Spend', 'Limit']
    };

    // 2. Prepare Data for Pie Chart (Leak Detector)
    // Aggregate expenses by category
    const categoryTotals: Record<string, number> = {};
    transactions.filter((t: Transaction) => t.type === 'expense' && t.wallet === 'pocket').forEach((t: Transaction) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    // If empty, categoryTotals will remain empty
    // Chart will handle empty data or we can show a message
    const hasData = Object.keys(categoryTotals).length > 0;

    const pieChartData = Object.keys(categoryTotals).map((cat, index) => {
        const pieColors = [colors.primaryStart, colors.primaryEnd, colors.accent, '#FCD34D', '#A78BFA'];
        return {
            name: cat,
            population: categoryTotals[cat],
            color: pieColors[index % pieColors.length],
            legendFontColor: colors.textSecondary,
            legendFontSize: 12
        };
    });

    // 3. Savings Velocity
    // Find first non-filled goal
    const nextGoal = goalsWithFunding.find(g => g.savedAmount < g.targetAmount);
    let velocityMsg = "All goals reached! 🎉";

    if (nextGoal) {
        const remaining = nextGoal.targetAmount - nextGoal.savedAmount;
        const dailySavingsRate = 1000; // Mock average savings
        const daysToGoal = Math.ceil(remaining / dailySavingsRate);
        velocityMsg = `Reach "${nextGoal.name}" in ~${daysToGoal} days`;
    }

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Insights</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Financial Health Check</Text>
                </View>

                {/* Burn Rate Chart */}
                <GlassContainer style={styles.chartCard} intensity={20}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Burn Rate (Last 7 Days)</Text>
                    <LineChart
                        data={lineChartData}
                        width={screenWidth - 64} // padding 20*2 + card padding 12*2 approx
                        height={220}
                        chartConfig={{
                            backgroundColor: 'transparent',
                            backgroundGradientFrom: 'transparent',
                            backgroundGradientTo: 'transparent',
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            decimalPlaces: 0,
                            color: (opacity = 1) => colors.text,
                            labelColor: (opacity = 1) => colors.text,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: colors.primaryStart
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                        withInnerLines={false}
                        withOuterLines={false}
                    />
                </GlassContainer>

                {/* Savings Velocity */}
                <GlassContainer style={[styles.velocityCard, { borderColor: colors.primaryEnd }]} intensity={30} hasGradient>
                    <Text style={[styles.velocityLabel, { color: colors.textSecondary }]}>Savings Velocity 🚀</Text>
                    <Text style={[styles.velocityValue, { color: colors.text }]}>{velocityMsg}</Text>
                </GlassContainer>

                {/* Leak Detector Pie Chart */}
                <GlassContainer style={styles.chartCard} intensity={20}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Leak Detector (Category Split)</Text>
                    {hasData ? (
                        <PieChart
                            data={pieChartData}
                            width={screenWidth - 50}
                            height={220}
                            chartConfig={{
                                color: (opacity = 1) => colors.text,
                                decimalPlaces: 0,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                            hasLegend={true}
                        />
                    ) : (
                        <View style={styles.emptyChartContainer}>
                            <Text style={[styles.emptyChartText, { color: colors.textSecondary }]}>No spending data yet.</Text>
                        </View>
                    )}
                </GlassContainer>

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
    chartCard: {
        marginHorizontal: 20,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    velocityCard: {
        marginHorizontal: 20,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
    },
    velocityLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    velocityValue: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyChartContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyChartText: {
        fontStyle: 'italic',
    }
});

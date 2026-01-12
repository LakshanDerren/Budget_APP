import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppTheme } from '../hooks/useAppTheme';
import { GlassContainer } from './GlassContainer';

interface GoalCardProps {
    name: string;
    targetAmount: number;
    savedAmount: number;
    priority: number;
    isActive: boolean;
    onRedeem?: () => void;
    onRemove?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
    name,
    targetAmount,
    savedAmount,
    priority,
    isActive,
    onRedeem,
    onRemove,
    onMoveUp,
    onMoveDown
}) => {
    const { colors } = useAppTheme();
    const percentage = Math.min((savedAmount / targetAmount) * 100, 100);
    const progressWidth = useSharedValue(0);
    const isFullyFunded = savedAmount >= targetAmount;

    useEffect(() => {
        progressWidth.value = withTiming(percentage, { duration: 1000 });
    }, [percentage]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
        };
    });

    return (
        <GlassContainer
            style={[
                styles.container,
                isActive ? { borderColor: colors.primaryStart, borderWidth: 1 } : { opacity: 0.8 }
            ]}
            intensity={isActive ? 30 : 15}
        >
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.priorityBadge}>
                        <Text style={[styles.priorityText, { color: colors.text }]}>#{priority}</Text>
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
                </View>
                <View style={styles.reorderControls}>
                    {onMoveUp && (
                        <TouchableOpacity onPress={onMoveUp} style={styles.controlButton}>
                            <Ionicons name="chevron-up" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    {onMoveDown && (
                        <TouchableOpacity onPress={onMoveDown} style={styles.controlButton}>
                            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.amountRow}>
                    <Text style={[styles.amountText, { color: colors.text }]}>LKR {savedAmount.toLocaleString()}</Text>
                    <Text style={[styles.targetText, { color: colors.textSecondary }]}> / {targetAmount.toLocaleString()}</Text>
                </View>

                <View style={styles.progressBarBackground}>
                    <Animated.View style={[
                        styles.progressBarFill,
                        animatedStyle,
                        { backgroundColor: isActive ? colors.primaryStart : colors.textSecondary }
                    ]} />
                </View>
            </View>

            {isActive && (
                <View style={styles.activeIndicator}>
                    <Text style={[styles.activeText, { color: colors.success }]}>• Currently Funding</Text>
                </View>
            )}

            <View style={styles.actionsRow}>
                {isFullyFunded && onRedeem && (
                    <TouchableOpacity onPress={onRedeem} style={[styles.actionButton, { backgroundColor: colors.primaryStart }]}>
                        <Text style={styles.actionButtonText}>Done</Text>
                    </TouchableOpacity>
                )}
                {!isFullyFunded && isActive && (
                    <View style={{ flex: 1 }} /> /* Spacer */
                )}
                {onRemove && (
                    <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                        <Text style={[styles.removeButtonText, { color: colors.error }]}>Remove</Text>
                    </TouchableOpacity>
                )}
            </View>
        </GlassContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: 16,
        borderRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reorderControls: {
        flexDirection: 'row',
        gap: 4,
    },
    controlButton: {
        padding: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
    },
    priorityBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 12,
    },
    priorityText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    progressContainer: {
        gap: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    amountText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    targetText: {
        fontSize: 14,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    activeIndicator: {
        marginTop: 12,
    },
    activeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    removeButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 99, 71, 0.3)', // Faint red border
        backgroundColor: 'rgba(255, 99, 71, 0.1)', // Faint red bg
    },
    removeButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

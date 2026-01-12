import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { QuickTapItem } from '../store/slices/walletSlice';
import { GlassContainer } from './GlassContainer';

interface QuickTapsProps {
    items: QuickTapItem[];
    onPress: (item: QuickTapItem) => void;
}

export const QuickTaps: React.FC<QuickTapsProps> = ({ items, onPress }) => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Quick Add</Text>
            {(!items || items.length === 0) ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        No shortcuts yet. Add an expense to create one automatically!
                    </Text>
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {items.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => onPress(item)} activeOpacity={0.7}>
                            <GlassContainer style={styles.item} intensity={30}>
                                <Ionicons name={item.icon} size={24} color={colors.primaryStart} />
                                <Text style={[styles.itemText, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.amountText, { color: colors.textSecondary }]}>LKR {item.amount}</Text>
                            </GlassContainer>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 20,
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        borderRadius: 16,
        gap: 6,
    },
    itemText: {
        fontWeight: '600',
        fontSize: 14,
    },
    amountText: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyContainer: {
        paddingHorizontal: 20,
        height: 80,
        justifyContent: 'center',
    },
    emptyText: {
        fontStyle: 'italic',
        fontSize: 14,
    }
});

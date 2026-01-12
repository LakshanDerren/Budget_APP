import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { useAppTheme } from '../hooks/useAppTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularGaugeProps {
    percentage: number; // 0 to 100
    radius?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    label?: string;
    subLabel?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
    percentage,
    radius = 120,
    strokeWidth = 20,
    color,
    trackColor,
    label,
    subLabel
}) => {
    const { colors } = useAppTheme();
    const activeColor = color || colors.primaryStart;
    const inactiveColor = trackColor || colors.glassBorder;

    const circumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(percentage, {
            duration: 1500,
            easing: Easing.out(Easing.exp),
        });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - (circumference * progressValue.value) / 100;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={styles.container}>
            <Svg
                width={radius * 2 + strokeWidth * 2}
                height={radius * 2 + strokeWidth * 2}
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
            >
                <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                    {/* Background Circle */}
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={inactiveColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeOpacity={0.2}
                    />
                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={activeColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.labelContainer}>
                {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
                {subLabel && <Text style={[styles.subLabel, { color: colors.textSecondary }]}>{subLabel}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subLabel: {
        fontSize: 14,
        marginTop: 4,
    }
});

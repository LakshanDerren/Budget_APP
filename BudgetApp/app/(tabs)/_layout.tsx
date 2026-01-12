import { FAB } from '@/src/components/FAB';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();

  const handleFabPress = () => {
    router.push('/modal');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            height: Platform.OS === 'ios' ? 85 : 60,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={{ flex: 1, backgroundColor: colors.tabBarBackground }}
            />
          ),
          tabBarActiveTintColor: colors.primaryEnd,
          tabBarInactiveTintColor: colors.textSecondary,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Pulse',
            tabBarIcon: ({ color, size }) => <Ionicons name="pulse" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="milestones"
          options={{
            title: 'Milestones',
            tabBarIcon: ({ color, size }) => <Ionicons name="flag" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
          }}
        />
      </Tabs>
      <FAB onPress={handleFabPress} />
    </>
  );
}

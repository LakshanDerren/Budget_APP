import { GlassContainer } from '@/src/components/GlassContainer';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();

  const options = [
    {
      title: 'Log Expense',
      description: 'Track spending like Food, Transport, etc.',
      icon: 'receipt',
      route: '/add-expense',
      color: colors.error
    },
    {
      title: 'New Milestone',
      description: 'Create a savings goal for something special.',
      icon: 'flag',
      route: '/add-milestone',
      color: colors.primaryStart
    },
    {
      title: 'Deposit',
      description: 'Add income to your Pocket or Vault.',
      icon: 'wallet',
      route: '/deposit',
      color: colors.success
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Actions</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>What would you like to do?</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.closeButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => {
              router.push(option.route as any);
            }}>
              <GlassContainer style={styles.optionCard} intensity={25} hasGradient>
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                    <Ionicons name={option.icon as any} size={28} color={option.color} />
                  </View>
                  <View style={[styles.textContainer, { flex: 1 }]}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>{option.description}</Text>
                  </View>
                  <View style={[styles.arrowContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </View>
                </View>
              </GlassContainer>
            </TouchableOpacity>
          ))}
        </View>

        {/* Use a light status bar on iOS to account for the modal appearance */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : (isDark ? 'light' : 'dark')} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

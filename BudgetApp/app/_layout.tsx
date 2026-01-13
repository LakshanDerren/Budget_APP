import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../src/store/store';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LogBox } from 'react-native';

// Suppress "Unknown event handler property" warnings caused by react-native-chart-kit / react-native-svg version mismatch
LogBox.ignoreLogs([
  'Unknown event handler property',
  'TouchableMixin is'
]);

export const unstable_settings = {
  anchor: '(tabs)',
};

import { logout } from '@/src/store/slices/authSlice';
import { DefaultTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store/store';

function RootLayoutNav() {
  const { themeMode } = useSelector((state: RootState) => state.settings);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const isDark = themeMode === 'system' ? colorScheme === 'dark' : themeMode === 'dark';

  useEffect(() => {
    // Legacy cleanup: If authenticated but no token (or old user structure), logout
    if (isAuthenticated && (!user || !user.token)) {
      console.log('Detected legacy auth state. Logging out...');
      dispatch(logout());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootLayoutNav />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

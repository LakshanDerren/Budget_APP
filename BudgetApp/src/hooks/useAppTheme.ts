import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { THEMES } from '../constants/theme';
import { RootState } from '../store/store';

export function useAppTheme() {
    const { themeMode } = useSelector((state: RootState) => state.settings);
    const systemScheme = useColorScheme();

    const isDark = themeMode === 'system'
        ? systemScheme === 'dark'
        : themeMode === 'dark';

    const colors = isDark ? THEMES.dark : THEMES.light;

    return {
        colors,
        isDark,
        themeMode
    };
}

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0061A4', // Material 3 Blue Primary
    onPrimary: '#FFFFFF',
    primaryContainer: '#D1E4FF',
    onPrimaryContainer: '#001D36',
    secondary: '#535F70',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D7E3F7',
    onSecondaryContainer: '#101C2B',
    surface: '#FDFCFF',
    onSurface: '#1A1C1E',
    surfaceVariant: '#F0F4FA',
    onSurfaceVariant: '#43474E',
    background: '#FDFCFF',
    onBackground: '#1A1C1E',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    outline: '#73777F',
    outlineVariant: '#C3C7D0',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: '#F0F4FA',
      level2: '#EBF1F8',
      level3: '#E3EBF5',
      level4: '#E1E9F4',
      level5: '#DDE6F2',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9ECAFF',
    onPrimary: '#003258',
    primaryContainer: '#00497D',
    onPrimaryContainer: '#D1E4FF',
    secondary: '#BBC7DB',
    onSecondary: '#253140',
    secondaryContainer: '#3B4858',
    onSecondaryContainer: '#D7E3F7',
    surface: '#1A1C1E',
    onSurface: '#E2E2E6',
    surfaceVariant: '#43474E',
    onSurfaceVariant: '#C3C7D0',
    background: '#111315',
    onBackground: '#E2E2E6',
    error: '#FFB4AB',
    onError: '#690005',
    outline: '#8D9199',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: '#20242A',
      level2: '#252A32',
      level3: '#2A303A',
      level4: '#2C323D',
      level5: '#2F3643',
    },
  },
};

export type AppTheme = typeof lightTheme;

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2', // Material Blue
    onPrimary: '#FFFFFF',
    primaryContainer: '#D1E4FF',
    onPrimaryContainer: '#001D36',
    secondary: '#0288D1',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#C2E7FF',
    onSecondaryContainer: '#001E2F',
    surface: '#FFFFFF',
    onSurface: '#1A1C1E',
    surfaceVariant: '#E1E2EC',
    onSurfaceVariant: '#44474F',
    background: '#F8F9FA',
    onBackground: '#1A1C1E',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    outline: '#74777F',
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
    secondary: '#7BD0FF',
    onSecondary: '#00354E',
    secondaryContainer: '#004C6E',
    onSecondaryContainer: '#C2E7FF',
    surface: '#1A1C1E',
    onSurface: '#E2E2E6',
    surfaceVariant: '#44474F',
    onSurfaceVariant: '#C4C6D0',
    background: '#111315',
    onBackground: '#E2E2E6',
    error: '#FFB4AB',
    onError: '#690005',
    outline: '#8E9099',
  },
};

export type AppTheme = typeof lightTheme;

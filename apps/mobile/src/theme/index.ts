import { Platform } from 'react-native';

export const colors = {
  // Primary colors
  primary: {
    50: '#e6f2ff',
    100: '#bfddff',
    200: '#99c9ff',
    300: '#73b5ff',
    400: '#4da1ff',
    500: '#268dff', // Main primary
    600: '#0078ff',
    700: '#0062cc',
    800: '#004c99',
    900: '#003666',
  },

  // Secondary colors
  secondary: {
    50: '#f0e6ff',
    100: '#d9bfff',
    200: '#c299ff',
    300: '#ab73ff',
    400: '#944dff',
    500: '#7d26ff', // Main secondary
    600: '#6600ff',
    700: '#5200cc',
    800: '#3e0099',
    900: '#2a0066',
  },

  // Success colors
  success: {
    50: '#e6f9f0',
    100: '#b3ecd4',
    200: '#80dfb8',
    300: '#4dd29c',
    400: '#1ac580',
    500: '#00b864', // Main success
    600: '#009650',
    700: '#00743c',
    800: '#005228',
    900: '#003014',
  },

  // Error colors
  error: {
    50: '#ffe6e6',
    100: '#ffb3b3',
    200: '#ff8080',
    300: '#ff4d4d',
    400: '#ff1a1a',
    500: '#e60000', // Main error
    600: '#cc0000',
    700: '#990000',
    800: '#660000',
    900: '#330000',
  },

  // Warning colors
  warning: {
    50: '#fff8e6',
    100: '#ffecb3',
    200: '#ffe080',
    300: '#ffd44d',
    400: '#ffc81a',
    500: '#ffbb00', // Main warning
    600: '#e6a800',
    700: '#b38300',
    800: '#805e00',
    900: '#4d3900',
  },

  // Info colors
  info: {
    50: '#e6f7ff',
    100: '#b3e5ff',
    200: '#80d3ff',
    300: '#4dc1ff',
    400: '#1aafff',
    500: '#009dff', // Main info
    600: '#008ae6',
    700: '#0068b3',
    800: '#004680',
    900: '#00244d',
  },

  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors - Light theme
  light: {
    background: '#ffffff',
    foreground: '#111827',
    card: '#ffffff',
    cardBorder: '#e5e7eb',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      disabled: '#d1d5db',
      inverse: '#ffffff',
    },
    border: '#e5e7eb',
    divider: '#f3f4f6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Semantic colors - Dark theme
  dark: {
    background: '#111827',
    foreground: '#f9fafb',
    card: '#1f2937',
    cardBorder: '#374151',
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      disabled: '#6b7280',
      inverse: '#111827',
    },
    border: '#374151',
    divider: '#1f2937',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const typography = {
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },

  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 56,
  },

  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;

/**
 * Design tokens for the app. Colors are defined once per scheme and read
 * through `useTheme()` so every screen stays consistent in light and dark.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#60646C',
    textMuted: '#8B8F98',
    background: '#F7F8FA',
    card: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    border: '#E4E6EB',
    primary: '#1F6FEB',
    primaryText: '#FFFFFF',
    primarySoft: '#E8F1FE',
    danger: '#D93636',
    dangerSoft: '#FDECEC',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    textMuted: '#7C8085',
    background: '#0B0C0E',
    card: '#161719',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    border: '#2A2C30',
    primary: '#4D8DF6',
    primaryText: '#0B0C0E',
    primarySoft: '#152441',
    danger: '#F26D6D',
    dangerSoft: '#2A1618',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
  pill: 999,
} as const;

export const MaxContentWidth = 640;

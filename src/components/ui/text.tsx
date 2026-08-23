import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Variant = 'title' | 'heading' | 'body' | 'label' | 'caption';
type Tone = 'default' | 'secondary' | 'muted' | 'primary' | 'danger' | 'onPrimary';

export type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
};

export function Text({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  const colors = useTheme();

  const color = {
    default: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    primary: colors.primary,
    danger: colors.danger,
    onPrimary: colors.primaryText,
  }[tone];

  return <RNText {...rest} style={[styles[variant], { color }, style]} />;
}

const styles = StyleSheet.create({
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.2 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
});

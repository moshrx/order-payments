import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './text';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  busy?: boolean;
};

export function Button({ label, variant = 'primary', busy = false, disabled, ...rest }: ButtonProps) {
  const colors = useTheme();
  const isDisabled = disabled || busy;

  const background = {
    primary: colors.primary,
    secondary: colors.backgroundElement,
    danger: colors.dangerSoft,
  }[variant];

  const tone = ({ primary: 'onPrimary', secondary: 'default', danger: 'danger' } as const)[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy }}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      {busy ? (
        <ActivityIndicator color={variant === 'primary' ? colors.primaryText : colors.text} />
      ) : (
        <Text variant="heading" tone={tone}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});

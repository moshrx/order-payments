import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './text';

export function Badge({ label }: { label: string }) {
  const colors = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
      <Text variant="caption" tone="primary" style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
  },
  text: { fontWeight: '600' },
});

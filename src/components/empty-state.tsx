import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function EmptyState({ title, message }: { title: string; message: string }) {
  const colors = useTheme();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text variant="heading" style={styles.centered}>
        {title}
      </Text>
      <Text variant="body" tone="secondary" style={styles.centered}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  centered: { textAlign: 'center' },
});

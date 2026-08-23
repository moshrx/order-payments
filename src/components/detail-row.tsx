import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function DetailRow({ label, value }: { label: string; value: string }) {
  const colors = useTheme();

  return (
    <View style={[styles.row, { borderTopColor: colors.border }]}>
      <Text variant="label" tone="muted">
        {label.toUpperCase()}
      </Text>
      <Text variant="body" selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

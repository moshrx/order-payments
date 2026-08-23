import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ErrorNotice({ message }: { message: string }) {
  const colors = useTheme();

  return (
    <View style={[styles.notice, { backgroundColor: colors.dangerSoft }]}>
      <Text variant="caption" tone="danger">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    padding: Spacing.three,
    borderRadius: Radius.medium,
  },
});

import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenProps = ViewProps & {
  /** Adds bottom safe-area padding. Turn off when the screen owns its own footer. */
  padBottom?: boolean;
};

/** Page shell: themed background, safe-area padding and a centered max width. */
export function Screen({ children, style, padBottom = true, ...rest }: ScreenProps) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View {...rest} style={[styles.root, { backgroundColor: colors.background }]}>
      {/* `style` lands on the content view so alignment from a screen reaches its children. */}
      <View
        style={[
          styles.content,
          { paddingBottom: padBottom ? insets.bottom + Spacing.three : 0 },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
});

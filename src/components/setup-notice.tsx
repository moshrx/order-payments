import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

/** Shown when the Supabase keys are missing, instead of letting every request fail. */
export function SetupNotice() {
  return (
    <Screen style={styles.screen}>
      <Card>
        <Text variant="heading">Not connected yet</Text>
        <View style={styles.body}>
          <Text variant="body" tone="secondary">
            Copy `.env.example` to `.env`, fill in your Supabase project URL and anon key, then
            restart the app with `npx expo start --clear`.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center', padding: Spacing.three },
  body: { marginTop: Spacing.two },
});

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ErrorNotice } from '@/components/error-notice';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useOrders } from '@/features/orders/orders-provider';

type Errors = { name?: string; accountNo?: string };

export default function NewOrderScreen() {
  const router = useRouter();
  const { addOrder } = useOrders();

  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter the order name.';
    if (!accountNo.trim()) next.accountNo = 'Enter the order account number.';
    return next;
  }

  async function handleSave() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await addOrder({ name, accountNo, address });
      router.back();
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save the order.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen padBottom={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <Text variant="body" tone="secondary">
            Saved orders appear in your history and in the customer view.
          </Text>

          <View style={styles.form}>
            <TextField
              label="Order name"
              placeholder="e.g. Steel bolts — March"
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <TextField
              label="Order account no"
              placeholder="e.g. ACC-10482"
              value={accountNo}
              onChangeText={(value) => {
                setAccountNo(value);
                if (errors.accountNo) setErrors({ ...errors, accountNo: undefined });
              }}
              error={errors.accountNo}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TextField
              label="Address"
              hint="Optional"
              placeholder="Delivery address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.actions}>
            {saveError ? <ErrorNotice message={saveError} /> : null}
            <Button label="Save order" onPress={handleSave} busy={isSaving} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => router.back()}
              disabled={isSaving}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.three, gap: Spacing.four, paddingBottom: Spacing.five },
  form: { gap: Spacing.three },
  actions: { gap: Spacing.two },
});

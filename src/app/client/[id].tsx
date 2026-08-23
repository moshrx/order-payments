import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DetailRow } from '@/components/detail-row';
import { EmptyState } from '@/components/empty-state';
import { ErrorNotice } from '@/components/error-notice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { formatDate } from '@/features/orders/format';
import { useOrders } from '@/features/orders/orders-provider';

export default function ClientOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrder, removeOrder } = useOrders();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const order = getOrder(id);

  if (!order) {
    return (
      <Screen style={styles.centered}>
        <EmptyState title="Order not found" message="It may have been deleted already." />
      </Screen>
    );
  }

  async function handleDelete() {
    if (!order) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await removeOrder(order.id);
      router.back();
    } catch (cause) {
      setDeleteError(cause instanceof Error ? cause.message : 'Could not delete the order.');
      setIsDeleting(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text variant="title">{order.name}</Text>
          <View style={styles.rows}>
            <DetailRow label="Order account no" value={order.accountNo} />
            <DetailRow label="Address" value={order.address ?? 'Not provided'} />
            <DetailRow label="Recorded" value={formatDate(order.createdAt)} />
          </View>
        </Card>

        {isConfirming ? (
          <View style={styles.actions}>
            <Text variant="body" tone="secondary" style={styles.confirmText}>
              Delete this order? It will also disappear from the customer view.
            </Text>
            {deleteError ? <ErrorNotice message={deleteError} /> : null}
            <Button label="Delete order" variant="danger" onPress={handleDelete} busy={isDeleting} />
            <Button
              label="Keep it"
              variant="secondary"
              onPress={() => setIsConfirming(false)}
              disabled={isDeleting}
            />
          </View>
        ) : (
          <Button label="Delete order" variant="danger" onPress={() => setIsConfirming(true)} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', padding: Spacing.three },
  content: { padding: Spacing.three, gap: Spacing.four },
  rows: { marginTop: Spacing.three },
  actions: { gap: Spacing.two },
  confirmText: { textAlign: 'center' },
});

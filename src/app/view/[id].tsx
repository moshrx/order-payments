import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DetailRow } from '@/components/detail-row';
import { EmptyState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { formatDate } from '@/features/orders/format';
import { useOrders } from '@/features/orders/orders-provider';

export default function CustomerOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder } = useOrders();

  const order = getOrder(id);

  if (!order) {
    return (
      <Screen style={styles.centered}>
        <EmptyState title="Order not found" message="This order is no longer available." />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Badge label="View only" />

        <Card>
          <Text variant="title">{order.name}</Text>
          <View style={styles.rows}>
            <DetailRow label="Order account no" value={order.accountNo} />
            <DetailRow label="Address" value={order.address ?? 'Not provided'} />
            <DetailRow label="Recorded" value={formatDate(order.createdAt)} />
          </View>
        </Card>

        <Text variant="caption" tone="muted" style={styles.note}>
          These details are read-only. Contact the supplier for any changes.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', padding: Spacing.three },
  content: { padding: Spacing.three, gap: Spacing.three },
  rows: { marginTop: Spacing.three },
  note: { textAlign: 'center' },
});

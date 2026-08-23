import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { formatDate } from '@/features/orders/format';
import type { Order } from '@/features/orders/types';

export function OrderCard({ order, href }: { order: Order; href: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={`Order ${order.name}`}>
        {({ pressed }) => (
          <Card style={pressed && styles.pressed}>
            <Text variant="heading" numberOfLines={1}>
              {order.name}
            </Text>

            <View style={styles.meta}>
              <Text variant="body" tone="secondary" numberOfLines={1}>
                Acc no · {order.accountNo}
              </Text>
              {order.address ? (
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {order.address}
                </Text>
              ) : null}
            </View>

            <Text variant="caption" tone="muted">
              {formatDate(order.createdAt)}
            </Text>
          </Card>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
  meta: { marginTop: Spacing.two, marginBottom: Spacing.two + Spacing.one, gap: Spacing.half },
});

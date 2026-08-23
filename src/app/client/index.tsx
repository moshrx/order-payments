import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ErrorNotice } from '@/components/error-notice';
import { OrderCard } from '@/components/order-card';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useOrders } from '@/features/orders/orders-provider';
import { useTheme } from '@/hooks/use-theme';

export default function ClientHistoryScreen() {
  const router = useRouter();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { orders, isLoading, error, refresh } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }

  if (isLoading) {
    return (
      <Screen style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen padBottom={false}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            {error ? <ErrorNotice message={error} /> : null}
            <Text variant="caption" tone="muted">
              {orders.length === 1 ? '1 order' : `${orders.length} orders`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No orders yet"
            message="Add your first order and it will show up here, newest first."
          />
        }
        renderItem={({ item }) => <OrderCard order={item} href={`/client/${item.id}`} />}
      />

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.three,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}>
        <Button label="New order" onPress={() => router.push('/client/new')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.three, gap: Spacing.three, flexGrow: 1 },
  header: { gap: Spacing.three },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

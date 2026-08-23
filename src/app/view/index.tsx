import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ErrorNotice } from '@/components/error-notice';
import { OrderCard } from '@/components/order-card';
import { SetupNotice } from '@/components/setup-notice';
import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useOrders } from '@/features/orders/orders-provider';
import { useTheme } from '@/hooks/use-theme';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function CustomerOrdersScreen() {
  const colors = useTheme();
  const { orders, isLoading, error, refresh } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }

  if (!isSupabaseConfigured) return <SetupNotice />;

  if (isLoading) {
    return (
      <Screen style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            {error ? <ErrorNotice message={error} /> : null}
            <Badge label="View only" />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nothing to show yet"
            message="Orders appear here as soon as they are recorded."
          />
        }
        renderItem={({ item }) => <OrderCard order={item} href={`/view/${item.id}`} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.three, gap: Spacing.three, flexGrow: 1 },
  header: { gap: Spacing.three, alignItems: 'flex-start' },
});

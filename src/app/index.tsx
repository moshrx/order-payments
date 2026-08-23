import { Link, Redirect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SetupNotice } from '@/components/setup-notice';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useOrders } from '@/features/orders/orders-provider';
import { useTheme } from '@/hooks/use-theme';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isCustomerBuild } from '@/lib/variant';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();

  // The customer build has no admin screens to choose between.
  if (isCustomerBuild) return <Redirect href="/view" />;

  if (!isSupabaseConfigured) return <SetupNotice />;

  const count = orders.length;
  const countLabel = count === 1 ? '1 order recorded' : `${count} orders recorded`;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.five }]}>
        <View style={styles.header}>
          <Text variant="title">Orders</Text>
          <Text variant="body" tone="secondary">
            Record an order once, and it appears in the customer view straight away.
          </Text>
        </View>

        <View style={styles.options}>
          <RoleCard
            mark="C"
            title="Client"
            description="Add new orders and browse the full history."
            href="/client"
          />
          <RoleCard
            mark="U"
            title="Customer view"
            description="See order details only. Nothing can be changed here."
            href="/view"
          />
        </View>

        <Text variant="caption" tone="muted" style={styles.footer}>
          {countLabel}
        </Text>
      </ScrollView>
    </Screen>
  );
}

function RoleCard({
  mark,
  title,
  description,
  href,
}: {
  mark: string;
  title: string;
  description: string;
  href: '/client' | '/view';
}) {
  const colors = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={title}>
        {({ pressed }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.mark, { backgroundColor: colors.primarySoft }]}>
              <Text variant="heading" tone="primary">
                {mark}
              </Text>
            </View>

            <View style={styles.cardText}>
              <Text variant="heading">{title}</Text>
              <Text variant="caption" tone="secondary">
                {description}
              </Text>
            </View>

            <Text variant="heading" tone="muted">
              ›
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.five, flexGrow: 1 },
  header: { gap: Spacing.two },
  options: { gap: Spacing.three },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: { opacity: 0.7 },
  mark: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: Spacing.half },
  footer: { marginTop: 'auto' },
});

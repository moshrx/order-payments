import { SentOrderCard } from '@/components/sent-order-card';
import { SetupNotice } from '@/components/setup-notice';
import { fetchAmountsByPaymentId } from '@/features/orders/bank-details-repository';
import { fetchSentOrders } from '@/features/orders/sent-orders-repository';
import { isSupabaseConfigured } from '@/lib/supabase';

// Always render fresh: sent orders change whenever the admin sends or edits one.
export const dynamic = 'force-dynamic';

export default async function CustomerPage() {
  if (!isSupabaseConfigured) {
    return <SetupNotice missing={['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']} />;
  }

  let orders;
  let amounts: Map<string, number>;
  try {
    orders = await fetchSentOrders();
    amounts = await fetchAmountsByPaymentId(orders.map((o) => o.paymentId));
  } catch (e) {
    return (
      <main className="screen stack">
        <h1 className="title">Orders</h1>
        <p className="notice">{e instanceof Error ? e.message : 'Could not load orders.'}</p>
      </main>
    );
  }

  return (
    <main className="screen stack">
      <div className="stack-sm">
        <h1 className="title">Orders</h1>
        <p className="body secondary">Order details only. Nothing can be changed here.</p>
      </div>
      {orders.length === 0 ? (
        <p className="empty">No orders yet.</p>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <SentOrderCard
              key={order.paymentId}
              order={order}
              amountInr={amounts.get(order.paymentId) ?? 0}
            />
          ))}
        </div>
      )}
    </main>
  );
}

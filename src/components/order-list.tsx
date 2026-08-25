import { OrderCard } from '@/components/order-card';
import type { PaymentOrder } from '@/features/orders/types';

/** Admin list of Cash Flow payments; `sentIds` marks orders on the customer page. */
export function OrderList({
  orders,
  hrefBase,
  sentIds,
}: {
  orders: PaymentOrder[];
  hrefBase: string;
  sentIds?: Set<string>;
}) {
  if (orders.length === 0) {
    return <p className="empty">No payment orders yet.</p>;
  }

  return (
    <div className="stack">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          href={`${hrefBase}/${order.id}`}
          sent={sentIds?.has(order.id) ?? false}
        />
      ))}
    </div>
  );
}

import Link from 'next/link';

import { formatCad, formatDate, formatInr } from '@/features/orders/format';
import { fetchSentOrders } from '@/features/orders/sent-orders-repository';
import { requireAdmin } from '@/features/admin/auth';

export const metadata = { title: 'Sent orders' };

export default async function SentOrdersPage() {
  if (!(await requireAdmin())) return null;

  let orders;
  try {
    orders = await fetchSentOrders();
  } catch (e) {
    return (
      <main className="screen stack">
        <h1 className="title">Sent orders</h1>
        <p className="notice">{e instanceof Error ? e.message : 'Could not load sent orders.'}</p>
      </main>
    );
  }

  return (
    <main className="screen stack">
      <div className="stack-sm">
        <h1 className="title">Sent orders</h1>
        <p className="body secondary">
          {orders.length === 0
            ? 'Nothing on the customer page yet.'
            : `${orders.length} order${orders.length === 1 ? '' : 's'} on the customer page.`}
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="empty">Send an order from the Orders tab to show it here.</p>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <Link
              key={order.paymentId}
              href={`/admin/${order.paymentId}`}
              className="card stack-sm"
              aria-label={`Sent order for ${order.customerName}`}>
              <div className="spread">
                <h2 className="heading">{order.customerName}</h2>
                <span className="badge">Sent</span>
              </div>
              <p className="body secondary">
                {formatCad(order.amountCad)} · {formatInr(order.amountInr)}
              </p>
              <p className="caption muted">{order.phone}</p>
              <p className="caption muted">
                Order dated {formatDate(order.createdAt)} · sent {formatDate(order.sentAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

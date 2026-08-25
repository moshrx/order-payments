import Link from 'next/link';

import { formatDate, formatInr } from '@/features/orders/format';
import type { SentOrder } from '@/features/orders/types';

export function SentOrderCard({
  order,
  amountInr,
}: {
  order: SentOrder;
  /** The admin-entered payout amount; 0 when none has been set yet. */
  amountInr: number;
}) {
  return (
    <Link
      href={`/${order.paymentId}`}
      className="card stack-sm"
      aria-label={`Order for ${order.customerName}`}>
      <h2 className="heading">{order.customerName}</h2>
      {amountInr > 0 ? <p className="body secondary">{formatInr(amountInr)}</p> : null}
      <p className="caption muted">{formatDate(order.createdAt)}</p>
    </Link>
  );
}

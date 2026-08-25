import Link from 'next/link';

import { formatCad, formatDate, formatInr } from '@/features/orders/format';
import type { PaymentOrder } from '@/features/orders/types';

import { StatusBadge } from './status-badge';

export function OrderCard({
  order,
  href,
  sent = false,
}: {
  order: PaymentOrder;
  href: string;
  sent?: boolean;
}) {
  return (
    <Link href={href} className="card stack-sm" aria-label={`Order for ${order.customerName}`}>
      <div className="spread">
        <h2 className="heading">{order.customerName}</h2>
        <span className="badge-row">
          {sent ? <span className="badge">Sent</span> : null}
          <StatusBadge status={order.paymentStatus} />
        </span>
      </div>
      <p className="body secondary">
        {formatCad(order.amountCad)} · {formatInr(order.amountInr)}
      </p>
      {order.balanceCad > 0 ? (
        <p className="caption muted">Balance {formatCad(order.balanceCad)}</p>
      ) : null}
      <p className="caption muted">{formatDate(order.createdAt)}</p>
    </Link>
  );
}

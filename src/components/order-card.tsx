import Link from 'next/link';

import { formatDate } from '@/features/orders/format';
import type { Order } from '@/features/orders/types';

export function OrderCard({ order, href }: { order: Order; href: string }) {
  return (
    <Link href={href} className="card stack-sm" aria-label={`Order ${order.name}`}>
      <h2 className="heading">{order.name}</h2>
      <p className="body secondary">Acc no · {order.accountNo}</p>
      {order.address ? <p className="caption muted">{order.address}</p> : null}
      <p className="caption muted">{formatDate(order.createdAt)}</p>
    </Link>
  );
}

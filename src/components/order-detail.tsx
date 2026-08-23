'use client';

import { useEffect, useState } from 'react';

import { fetchOrders } from '@/features/orders/orders-repository';
import { formatDate } from '@/features/orders/format';
import type { Order } from '@/features/orders/types';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="spread">
      <span className="body secondary">{label}</span>
      <span className="body">{value}</span>
    </div>
  );
}

export function OrderDetail({ id, children }: { id: string; children?: React.ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((all) => setOrder(all.find((o) => o.id === id) ?? null))
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load the order.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <p className="body muted">Loading…</p>;
  if (error) return <p className="notice">{error}</p>;
  if (!order) return <p className="empty">That order no longer exists.</p>;

  return (
    <div className="stack">
      <div className="card stack-sm">
        <Row label="Name" value={order.name} />
        <Row label="Account no" value={order.accountNo} />
        {order.address ? <Row label="Address" value={order.address} /> : null}
        <Row label="Recorded" value={formatDate(order.createdAt)} />
      </div>
      {children}
    </div>
  );
}

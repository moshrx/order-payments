'use client';

import { useCallback, useEffect, useState } from 'react';

import { OrderCard } from '@/components/order-card';
import { fetchOrders, subscribeToOrders } from '@/features/orders/orders-repository';
import type { Order } from '@/features/orders/types';

/** Shared list for both the customer and admin views; `href` sets where a row links. */
export function OrderList({ hrefBase }: { hrefBase: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setOrders(await fetchOrders());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Push inserts and deletes from other devices straight into the list.
    return subscribeToOrders(load);
  }, [load]);

  if (isLoading) return <p className="body muted">Loading…</p>;
  if (error) return <p className="notice">{error}</p>;
  if (orders.length === 0) {
    return <p className="empty">No orders yet.</p>;
  }

  return (
    <div className="stack">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} href={`${hrefBase}/${order.id}`} />
      ))}
    </div>
  );
}

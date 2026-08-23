import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { isSupabaseConfigured } from '@/lib/supabase';

import { deleteOrder, fetchOrders, insertOrder, subscribeToOrders } from './orders-repository';
import type { NewOrder, Order } from './types';

type OrdersContextValue = {
  orders: Order[];
  isLoading: boolean;
  /** Set when the last load failed, so screens can show it instead of an empty list. */
  error: string | null;
  refresh: () => Promise<void>;
  addOrder: (input: NewOrder) => Promise<Order>;
  removeOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      setOrders(await fetchOrders());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Load once, then let Supabase realtime push every later insert or delete —
    // that is what keeps a customer's open screen in step with the client's app.
    // The lint rule guards against cascading renders; every setState in `refresh`
    // happens after an await, so nothing here runs synchronously during the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();

    return subscribeToOrders(() => void refresh());
  }, [refresh]);

  const addOrder = useCallback(async (input: NewOrder) => {
    const order = await insertOrder(input);
    setOrders((current) => [order, ...current]);
    return order;
  }, []);

  const removeOrder = useCallback(async (id: string) => {
    await deleteOrder(id);
    setOrders((current) => current.filter((order) => order.id !== id));
  }, []);

  const getOrder = useCallback((id: string) => orders.find((order) => order.id === id), [orders]);

  const value = useMemo(
    () => ({ orders, isLoading, error, refresh, addOrder, removeOrder, getOrder }),
    [orders, isLoading, error, refresh, addOrder, removeOrder, getOrder]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used inside an <OrdersProvider>');
  }
  return context;
}

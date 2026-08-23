import { supabase } from '@/lib/supabase';

import type { NewOrder, Order } from './types';

const TABLE = 'orders';

/** Shape of a row in `public.orders`. */
type OrderRow = {
  id: string;
  name: string;
  account_no: string;
  address: string | null;
  created_at: string;
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    name: row.name,
    accountNo: row.account_no,
    address: row.address ?? undefined,
    createdAt: row.created_at,
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, account_no, address, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toOrder);
}

export async function insertOrder(input: NewOrder): Promise<Order> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: input.name.trim(),
      account_no: input.accountNo.trim(),
      address: input.address?.trim() || null,
    })
    .select('id, name, account_no, address, created_at')
    .single();

  if (error) throw new Error(error.message);
  return toOrder(data);
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Calls `onChange` whenever an order is added or removed on any device. */
export function subscribeToOrders(onChange: () => void) {
  const channel = supabase
    .channel('public:orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

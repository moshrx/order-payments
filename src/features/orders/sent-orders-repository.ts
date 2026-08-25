import { supabase } from '@/lib/supabase';

import type { SentOrder, SentOrderInput } from './types';

const TABLE = 'sent_orders';

/** Shape of a row in `public.sent_orders`. */
type SentOrderRow = {
  payment_id: string;
  customer_name: string;
  phone: string;
  amount_cad: number;
  amount_inr: number;
  created_at: string;
  sent_at: string;
};

const COLUMNS = 'payment_id, customer_name, phone, amount_cad, amount_inr, created_at, sent_at';

function toSentOrder(row: SentOrderRow): SentOrder {
  return {
    paymentId: row.payment_id,
    customerName: row.customer_name,
    phone: row.phone,
    amountCad: row.amount_cad,
    amountInr: row.amount_inr,
    createdAt: row.created_at,
    sentAt: row.sent_at,
  };
}

export async function fetchSentOrders(): Promise<SentOrder[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toSentOrder);
}

export async function fetchSentOrder(paymentId: string): Promise<SentOrder | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toSentOrder(data) : null;
}

/** Which of the given payments are on the customer page; for the admin list. */
export async function fetchSentOrderIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from(TABLE).select('payment_id');

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.payment_id));
}

export async function upsertSentOrder(input: SentOrderInput): Promise<SentOrder> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        payment_id: input.paymentId,
        customer_name: input.customerName,
        phone: input.phone,
        amount_cad: input.amountCad,
        amount_inr: input.amountInr,
        created_at: input.createdAt,
      },
      { onConflict: 'payment_id' }
    )
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toSentOrder(data);
}

export async function deleteSentOrder(paymentId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('payment_id', paymentId);
  if (error) throw new Error(error.message);
}

import { supabase } from '@/lib/supabase';

import type { BankDetails, BankDetailsInput } from './types';

const TABLE = 'bank_details';

/** Shape of a row in `public.bank_details`. */
type BankDetailsRow = {
  payment_id: string;
  account_holder: string;
  account_number: string;
  ifsc: string;
  bank_name: string | null;
  amount_inr: number | null;
  updated_at: string;
};

const COLUMNS =
  'payment_id, account_holder, account_number, ifsc, bank_name, amount_inr, updated_at';

function toBankDetails(row: BankDetailsRow): BankDetails {
  return {
    paymentId: row.payment_id,
    accountHolder: row.account_holder,
    accountNumber: row.account_number,
    ifsc: row.ifsc,
    bankName: row.bank_name ?? undefined,
    // Rows saved before the amount existed read as 0 until the admin sets one.
    amountInr: row.amount_inr ?? 0,
    updatedAt: row.updated_at,
  };
}

export async function fetchBankDetails(paymentId: string): Promise<BankDetails | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toBankDetails(data) : null;
}

/** Payout amounts keyed by payment id, for listing many orders at once. */
export async function fetchAmountsByPaymentId(
  paymentIds: string[]
): Promise<Map<string, number>> {
  if (paymentIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from(TABLE)
    .select('payment_id, amount_inr')
    .in('payment_id', paymentIds);

  if (error) throw new Error(error.message);
  return new Map((data ?? []).map((row) => [row.payment_id, row.amount_inr ?? 0]));
}

export async function upsertBankDetails(input: BankDetailsInput): Promise<BankDetails> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        payment_id: input.paymentId,
        account_holder: input.accountHolder,
        account_number: input.accountNumber,
        ifsc: input.ifsc,
        bank_name: input.bankName ?? null,
        amount_inr: input.amountInr,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'payment_id' }
    )
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toBankDetails(data);
}

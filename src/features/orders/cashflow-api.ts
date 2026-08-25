import type { PaymentOrder, PaymentStatus } from './types';

// Server-only: CASHFLOW_API_KEY has no NEXT_PUBLIC_ prefix, so these calls
// must stay in Server Components / Server Functions.
const baseUrl = process.env.CASHFLOW_API_URL;
const apiKey = process.env.CASHFLOW_API_KEY;

/** False until .env.local holds the Cash Flow API URL and key. */
export const isCashflowConfigured = Boolean(baseUrl && apiKey);

/** Shape of a payment in the Cash Flow API responses. */
type PaymentRow = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  amount_cad: number;
  rate_inr: number;
  amount_inr: number;
  paid_cad: number;
  payment_status: PaymentStatus;
  balance_cad: number;
  balance_inr: number;
  delivered_at: string | null;
  delivered: boolean;
  remark: string | null;
};

function toOrder(row: PaymentRow): PaymentOrder {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    amountCad: row.amount_cad,
    rateInr: row.rate_inr,
    amountInr: row.amount_inr,
    paidCad: row.paid_cad,
    paymentStatus: row.payment_status,
    balanceCad: row.balance_cad,
    balanceInr: row.balance_inr,
    delivered: row.delivered,
    deliveredAt: row.delivered_at,
    remark: row.remark ?? undefined,
    createdAt: row.created_at,
  };
}

async function request(path: string): Promise<Response> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Cash Flow API responded ${res.status} for ${path}.`);
  }
  return res;
}

export type PaymentOrdersPage = {
  orders: PaymentOrder[];
  total: number;
  page: number;
  pageCount: number;
};

export async function fetchPaymentOrdersPage(
  page: number,
  pageSize: number
): Promise<PaymentOrdersPage> {
  const offset = (page - 1) * pageSize;
  const res = await request(`/api/payments?limit=${pageSize}&offset=${offset}`);
  const body: { payments: PaymentRow[]; pagination: { total: number } } = await res.json();

  return {
    orders: body.payments.map(toOrder),
    total: body.pagination.total,
    page,
    pageCount: Math.max(1, Math.ceil(body.pagination.total / pageSize)),
  };
}

export async function fetchPaymentOrder(id: string): Promise<PaymentOrder | null> {
  const res = await request(`/api/payments/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;

  const body: { payment: PaymentRow } = await res.json();
  return toOrder(body.payment);
}

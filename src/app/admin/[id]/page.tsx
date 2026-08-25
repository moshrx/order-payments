import Link from 'next/link';

import { BankDetailsForm } from '@/components/bank-details-form';
import { OrderDetail } from '@/components/order-detail';
import { SendOrderPanel } from '@/components/send-order-panel';
import { fetchBankDetails } from '@/features/orders/bank-details-repository';
import { fetchPaymentOrder } from '@/features/orders/cashflow-api';
import { fetchSentOrder } from '@/features/orders/sent-orders-repository';
import { requireAdmin } from '@/features/admin/auth';
import type { BankDetails, SentOrder } from '@/features/orders/types';

export const metadata = { title: 'Order details' };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return null;

  const { id } = await params;
  const order = await fetchPaymentOrder(id);

  // A missing Supabase table (schema not run yet) should not blank the
  // whole page; the save/send buttons surface the real error instead.
  let bankDetails: BankDetails | null = null;
  let sent: SentOrder | null = null;
  if (order) {
    [bankDetails, sent] = await Promise.all([
      fetchBankDetails(order.id).catch(() => null),
      fetchSentOrder(order.id).catch(() => null),
    ]);
  }

  return (
    <main className="screen stack">
      <Link href="/admin" className="body secondary">
        ‹ Payment orders
      </Link>
      <h1 className="title">Order details</h1>
      {order ? (
        <>
          <OrderDetail order={order} />
          <BankDetailsForm paymentId={order.id} existing={bankDetails} />
          <SendOrderPanel paymentId={order.id} sent={sent} />
        </>
      ) : (
        <p className="empty">That order no longer exists.</p>
      )}
    </main>
  );
}

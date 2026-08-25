import Link from 'next/link';

import { fetchBankDetails } from '@/features/orders/bank-details-repository';
import { fetchSentOrder } from '@/features/orders/sent-orders-repository';
import { formatDate, formatInr } from '@/features/orders/format';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="spread">
      <span className="body secondary">{label}</span>
      <span className="body">{value}</span>
    </div>
  );
}

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Customers only see orders the admin has sent, and only these fields.
  const order = await fetchSentOrder(id).catch(() => null);
  const bank = order ? await fetchBankDetails(order.paymentId).catch(() => null) : null;

  return (
    <main className="screen stack">
      <Link href="/" className="body secondary">
        ‹ Orders
      </Link>
      <h1 className="title">Order details</h1>
      {order ? (
        <>
          <div className="card stack-sm">
            <Row label="Customer" value={order.customerName} />
            <Row label="Phone" value={order.phone} />
            {/* The amount is the one the admin typed, never the Cash Flow figure. */}
            {bank && bank.amountInr > 0 ? (
              <Row label="Amount" value={formatInr(bank.amountInr)} />
            ) : null}
            <Row label="Date" value={formatDate(order.createdAt)} />
          </div>
          {bank ? (
            <div className="card stack-sm">
              <h2 className="heading">Bank details</h2>
              <Row label="Account holder" value={bank.accountHolder} />
              <Row label="Account no" value={bank.accountNumber} />
              <Row label="IFSC" value={bank.ifsc} />
              {bank.bankName ? <Row label="Bank" value={bank.bankName} /> : null}
            </div>
          ) : null}
        </>
      ) : (
        <p className="empty">That order is not available.</p>
      )}
    </main>
  );
}

import { formatCad, formatDate, formatInr } from '@/features/orders/format';
import type { PaymentOrder } from '@/features/orders/types';

import { StatusBadge } from './status-badge';

function Row({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="spread">
      <span className="body secondary">{label}</span>
      <span className="body">{value}</span>
    </div>
  );
}

export function OrderDetail({ order }: { order: PaymentOrder }) {
  return (
    <div className="card stack-sm">
      <Row label="Customer" value={order.customerName} />
      <Row label="Phone" value={order.phone} />
      <Row label="Status" value={<StatusBadge status={order.paymentStatus} />} />
      <Row label="Amount" value={formatCad(order.amountCad)} />
      <Row label="Rate" value={`₹${order.rateInr} / $1`} />
      <Row label="Amount (INR)" value={formatInr(order.amountInr)} />
      <Row label="Paid" value={formatCad(order.paidCad)} />
      {order.balanceCad > 0 ? (
        <Row
          label="Balance"
          value={`${formatCad(order.balanceCad)} · ${formatInr(order.balanceInr)}`}
        />
      ) : null}
      {order.remark ? <Row label="Remark" value={order.remark} /> : null}
      <Row label="Recorded" value={formatDate(order.createdAt)} />
    </div>
  );
}

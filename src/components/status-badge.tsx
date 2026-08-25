import type { PaymentStatus } from '@/features/orders/types';

const LABELS: Record<PaymentStatus, string> = {
  paid: 'Paid',
  partial: 'Partial',
  unpaid: 'Unpaid',
  advance: 'Advance',
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`badge status-${status}`}>{LABELS[status]}</span>;
}

import Link from 'next/link';

import { OrderList } from '@/components/order-list';
import { SetupNotice } from '@/components/setup-notice';
import {
  fetchPaymentOrdersPage,
  isCashflowConfigured,
  type PaymentOrdersPage,
} from '@/features/orders/cashflow-api';
import { fetchSentOrderIds } from '@/features/orders/sent-orders-repository';
import { requireAdmin } from '@/features/admin/auth';

export const metadata = { title: 'Payment orders' };

const PAGE_SIZE = 5;

function Pager({ page, pageCount }: { page: number; pageCount: number }) {
  if (pageCount <= 1) return null;

  return (
    <nav className="pager" aria-label="Pages">
      {page > 1 ? (
        <Link href={`/admin?page=${page - 1}`} className="button secondary-btn">
          ‹ Previous
        </Link>
      ) : (
        <span className="button secondary-btn pager-disabled">‹ Previous</span>
      )}
      <span className="caption muted">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={`/admin?page=${page + 1}`} className="button secondary-btn">
          Next ›
        </Link>
      ) : (
        <span className="button secondary-btn pager-disabled">Next ›</span>
      )}
    </nav>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Locked: render nothing. The layout shows the lock screen, and returning
  // early here keeps order data out of the page payload entirely.
  if (!(await requireAdmin())) return null;

  if (!isCashflowConfigured) {
    return <SetupNotice missing={['CASHFLOW_API_URL', 'CASHFLOW_API_KEY']} />;
  }

  const { page: pageParam } = await searchParams;
  const requested = Math.max(1, Math.floor(Number(pageParam)) || 1);

  let data: PaymentOrdersPage;
  let sentIds: Set<string>;
  try {
    // Clamp before fetching: a far-past-the-end offset makes the upstream API
    // fail outright, so asking for page 1 first is what makes the range known.
    const first = await fetchPaymentOrdersPage(1, PAGE_SIZE);
    const page = Math.min(requested, first.pageCount);

    [data, sentIds] = await Promise.all([
      page === 1 ? Promise.resolve(first) : fetchPaymentOrdersPage(page, PAGE_SIZE),
      // Missing sent_orders table just hides the "Sent" tags.
      fetchSentOrderIds().catch(() => new Set<string>()),
    ]);
  } catch (e) {
    return (
      <main className="screen stack">
        <h1 className="title">Payment orders</h1>
        <p className="notice">{e instanceof Error ? e.message : 'Could not load orders.'}</p>
      </main>
    );
  }

  return (
    <main className="screen stack">
      <div className="stack-sm">
        <h1 className="title">Payment orders</h1>
        <p className="body secondary">
          {`${data.total} order${data.total === 1 ? '' : 's'} in Cash Flow`} · {sentIds.size} on
          the customer page
        </p>
      </div>
      <OrderList orders={data.orders} hrefBase="/admin" sentIds={sentIds} />
      <Pager page={data.page} pageCount={data.pageCount} />
    </main>
  );
}

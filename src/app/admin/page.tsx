import Link from 'next/link';

import { OrderList } from '@/components/order-list';
import { SetupNotice } from '@/components/setup-notice';
import { isSupabaseConfigured } from '@/lib/supabase';

export const metadata = { title: 'Order history' };

export default function AdminPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <main className="screen stack">
      <div className="spread">
        <h1 className="title">Order history</h1>
        <Link href="/admin/new" className="button">
          New order
        </Link>
      </div>
      <OrderList hrefBase="/admin" />
    </main>
  );
}

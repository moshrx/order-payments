import { OrderList } from '@/components/order-list';
import { SetupNotice } from '@/components/setup-notice';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function CustomerPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <main className="screen stack">
      <div className="stack-sm">
        <h1 className="title">Orders</h1>
        <p className="body secondary">Order details only. Nothing can be changed here.</p>
      </div>
      <OrderList hrefBase="" />
    </main>
  );
}

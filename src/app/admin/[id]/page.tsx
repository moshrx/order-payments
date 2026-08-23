import Link from 'next/link';

import { DeleteOrderButton } from '@/components/delete-order-button';
import { OrderDetail } from '@/components/order-detail';

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="screen stack">
      <Link href="/admin" className="body secondary">
        ‹ Order history
      </Link>
      <h1 className="title">Order details</h1>
      <OrderDetail id={id}>
        <DeleteOrderButton id={id} />
      </OrderDetail>
    </main>
  );
}

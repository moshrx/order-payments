import Link from 'next/link';

import { OrderDetail } from '@/components/order-detail';

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="screen stack">
      <Link href="/" className="body secondary">
        ‹ Orders
      </Link>
      <h1 className="title">Order details</h1>
      <OrderDetail id={id} />
    </main>
  );
}

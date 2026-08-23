'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteOrder } from '@/features/orders/orders-repository';

export function DeleteOrderButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteOrder(id);
      router.push('/admin');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete the order.');
      setIsDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <button type="button" className="button danger-btn" onClick={() => setConfirming(true)}>
        Delete order
      </button>
    );
  }

  return (
    <div className="stack-sm">
      <p className="body secondary">Delete this order? This cannot be undone.</p>
      <div className="row">
        <button
          type="button"
          className="button danger-btn"
          onClick={handleDelete}
          disabled={isDeleting}>
          {isDeleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          type="button"
          className="button secondary-btn"
          onClick={() => setConfirming(false)}
          disabled={isDeleting}>
          Cancel
        </button>
      </div>
      {error ? <p className="notice">{error}</p> : null}
    </div>
  );
}

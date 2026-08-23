'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import { insertOrder } from '@/features/orders/orders-repository';

export default function NewOrderPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = name.trim() !== '' && accountNo.trim() !== '' && !isSaving;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    setIsSaving(true);
    setError(null);
    try {
      await insertOrder({ name, accountNo, address });
      router.push('/admin');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the order.');
      setIsSaving(false);
    }
  }

  return (
    <main className="screen stack">
      <Link href="/admin" className="body secondary">
        ‹ Order history
      </Link>
      <h1 className="title">New order</h1>

      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>

        <div className="field">
          <label htmlFor="account">Account no</label>
          <input
            id="account"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="address">Address (optional)</label>
          <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        {error ? <p className="notice">{error}</p> : null}

        <button type="submit" className="button" disabled={!canSave}>
          {isSaving ? 'Saving…' : 'Save order'}
        </button>
      </form>
    </main>
  );
}

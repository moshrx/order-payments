'use client';

import { useTransition } from 'react';

import { lock } from '@/features/admin/actions';

const STORAGE_KEY = 'cashflow.admin.password';

export function LockButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    // Locking must also forget the saved password, or the lock screen would
    // immediately unlock itself again.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable; the cookie is cleared either way.
    }
    startTransition(async () => {
      await lock();
    });
  }

  return (
    <button type="button" className="nav-link lock-btn" onClick={handleClick} disabled={isPending}>
      {isPending ? 'Locking…' : 'Lock'}
    </button>
  );
}

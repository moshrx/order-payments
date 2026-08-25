'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import { unlock, type UnlockState } from '@/features/admin/actions';

const STORAGE_KEY = 'cashflow.admin.password';
const initialState: UnlockState = { error: null };

/** Private to this browser; a shared device should leave "Remember" off. */
function readSaved(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AdminLockScreen() {
  const [state, formAction, isPending] = useActionState(unlock, initialState);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  // A saved password unlocks on arrival, so the gate stays out of the way.
  useEffect(() => {
    const saved = readSaved();
    if (!saved || submitted.current) return;

    submitted.current = true;
    setPassword(saved);
    setRemember(true);
    formRef.current?.requestSubmit();
  }, []);

  // Only keep a password that the server actually accepted.
  useEffect(() => {
    if (isPending || state.error === null) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable (private window); nothing to clean up.
    }
  }, [isPending, state.error]);

  function handleSubmit() {
    try {
      if (remember) localStorage.setItem(STORAGE_KEY, password);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Saving is a convenience; ignore a storage failure.
    }
  }

  return (
    <main className="screen stack lock-screen">
      <div className="stack-sm">
        <h1 className="title">Admin locked</h1>
        <p className="body secondary">Enter the admin password to manage payment orders.</p>
      </div>

      <form ref={formRef} className="card stack" action={formAction} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
        </div>

        <label className="check">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span className="body secondary">Remember on this device</span>
        </label>

        {state.error ? <p className="notice">{state.error}</p> : null}

        <button type="submit" className="button" disabled={isPending}>
          {isPending ? 'Unlocking…' : 'Unlock'}
        </button>
      </form>
    </main>
  );
}

'use client';

import { useActionState } from 'react';

import { saveBankDetails, type ActionState } from '@/features/orders/actions';
import type { BankDetails } from '@/features/orders/types';

const initialState: ActionState = { error: null, saved: false };

export function BankDetailsForm({
  paymentId,
  existing,
}: {
  paymentId: string;
  existing: BankDetails | null;
}) {
  const [state, formAction, isPending] = useActionState(saveBankDetails, initialState);

  return (
    <form className="card stack" action={formAction}>
      <h2 className="heading">Bank details &amp; payout</h2>
      <input type="hidden" name="paymentId" value={paymentId} />

      <div className="field">
        <label htmlFor="amountInr">Payout amount (INR)</label>
        <input
          id="amountInr"
          name="amountInr"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={existing && existing.amountInr > 0 ? existing.amountInr : ''}
          placeholder="e.g. 68640"
          required
        />
        <span className="caption muted">This is the only amount customers see.</span>
      </div>

      <div className="field">
        <label htmlFor="accountHolder">Account holder name</label>
        <input
          id="accountHolder"
          name="accountHolder"
          defaultValue={existing?.accountHolder ?? ''}
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="accountNumber">Account number</label>
        <input
          id="accountNumber"
          name="accountNumber"
          defaultValue={existing?.accountNumber ?? ''}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="ifsc">IFSC code</label>
        <input
          id="ifsc"
          name="ifsc"
          defaultValue={existing?.ifsc ?? ''}
          placeholder="HDFC0001234"
          style={{ textTransform: 'uppercase' }}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="bankName">Bank name (optional)</label>
        <input id="bankName" name="bankName" defaultValue={existing?.bankName ?? ''} />
      </div>

      {state.error ? <p className="notice">{state.error}</p> : null}
      {state.saved && !state.error ? <p className="body secondary">Bank details saved.</p> : null}

      <button type="submit" className="button" disabled={isPending}>
        {isPending ? 'Saving…' : existing ? 'Update bank details' : 'Save bank details'}
      </button>
    </form>
  );
}

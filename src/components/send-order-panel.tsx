'use client';

import { useActionState } from 'react';

import {
  sendOrder,
  unsendOrder,
  updateSentOrder,
  type ActionState,
} from '@/features/orders/actions';
import { formatDate } from '@/features/orders/format';
import type { SentOrder } from '@/features/orders/types';

const initialState: ActionState = { error: null, saved: false };

/** Send button when the order is not on the customer page yet. */
function SendForm({ paymentId }: { paymentId: string }) {
  const [state, formAction, isPending] = useActionState(sendOrder, initialState);

  return (
    <form className="card stack" action={formAction}>
      <h2 className="heading">Customer page</h2>
      <p className="body secondary">
        Not visible to customers yet. Sending shows the name, phone, date and the bank details
        and payout amount you entered above.
      </p>
      {state.error ? <p className="notice">{state.error}</p> : null}
      <input type="hidden" name="paymentId" value={paymentId} />
      <button type="submit" className="button" disabled={isPending}>
        {isPending ? 'Sending…' : 'Send to orders page'}
      </button>
    </form>
  );
}

/** Edit + remove once the order has been sent. */
function EditSentForm({ sent }: { sent: SentOrder }) {
  const [editState, editAction, isEditing] = useActionState(updateSentOrder, initialState);
  const [removeState, removeAction, isRemoving] = useActionState(unsendOrder, initialState);
  const error = editState.error ?? removeState.error;

  return (
    <form className="card stack" action={editAction}>
      <div className="spread">
        <h2 className="heading">Customer page</h2>
        <span className="badge">Sent</span>
      </div>
      <p className="body secondary">
        On the orders page since {formatDate(sent.sentAt)}. Edits here change what customers
        see, not the Cash Flow record.
      </p>
      <input type="hidden" name="paymentId" value={sent.paymentId} />

      <div className="field">
        <label htmlFor="sentCustomerName">Customer name</label>
        <input
          id="sentCustomerName"
          name="customerName"
          defaultValue={sent.customerName}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="sentPhone">Phone</label>
        <input id="sentPhone" name="phone" defaultValue={sent.phone} autoComplete="tel" required />
      </div>

      <p className="caption muted">
        The payout amount customers see is set in Bank details &amp; payout above.
      </p>

      {error ? <p className="notice">{error}</p> : null}
      {editState.saved && !error ? <p className="body secondary">Order updated.</p> : null}

      <div className="row">
        <button type="submit" className="button" disabled={isEditing || isRemoving}>
          {isEditing ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="submit"
          className="button danger-btn"
          formAction={removeAction}
          disabled={isEditing || isRemoving}>
          {isRemoving ? 'Removing…' : 'Remove from orders page'}
        </button>
      </div>
    </form>
  );
}

export function SendOrderPanel({
  paymentId,
  sent,
}: {
  paymentId: string;
  sent: SentOrder | null;
}) {
  return sent ? <EditSentForm sent={sent} /> : <SendForm paymentId={paymentId} />;
}

'use server';

import { revalidatePath } from 'next/cache';

import { isAdminUnlocked } from '@/features/admin/auth';

import { upsertBankDetails } from './bank-details-repository';
import { fetchPaymentOrder } from './cashflow-api';
import { deleteSentOrder, fetchSentOrder, upsertSentOrder } from './sent-orders-repository';

export type ActionState = {
  error: string | null;
  saved: boolean;
};

function failure(error: string): ActionState {
  return { error, saved: false };
}

/**
 * Server Functions are reachable by direct POST, not just through the UI,
 * so each one re-checks the admin session rather than trusting the page.
 */
async function locked(): Promise<ActionState | null> {
  return (await isAdminUnlocked()) ? null : failure('Session locked. Unlock and try again.');
}

function toMessage(e: unknown, fallback: string): string {
  return e instanceof Error ? e.message : fallback;
}

/** Everything the customer page shows is revalidated together. */
function revalidateOrderPages(paymentId: string) {
  revalidatePath('/');
  revalidatePath(`/${paymentId}`);
  revalidatePath(`/admin/${paymentId}`);
}

export async function saveBankDetails(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const denied = await locked();
  if (denied) return denied;

  const paymentId = String(formData.get('paymentId') ?? '').trim();
  const accountHolder = String(formData.get('accountHolder') ?? '').trim();
  const accountNumber = String(formData.get('accountNumber') ?? '').trim();
  const ifsc = String(formData.get('ifsc') ?? '').trim().toUpperCase();
  const bankName = String(formData.get('bankName') ?? '').trim();
  const amountInr = Number(formData.get('amountInr'));

  if (!paymentId || !accountHolder || !accountNumber || !ifsc) {
    return failure('Account holder, account number and IFSC code are required.');
  }
  if (!Number.isFinite(amountInr) || amountInr <= 0) {
    return failure('Enter the payout amount in INR.');
  }

  try {
    // The app has no sign-in, so the only gate is that the id must belong to
    // a real payment order in the Cash Flow account this server is keyed to.
    if (!(await fetchPaymentOrder(paymentId))) {
      return failure('That payment order no longer exists.');
    }

    await upsertBankDetails({
      paymentId,
      accountHolder,
      accountNumber,
      ifsc,
      bankName: bankName || undefined,
      amountInr,
    });
  } catch (e) {
    return failure(toMessage(e, 'Could not save the bank details.'));
  }

  revalidateOrderPages(paymentId);
  return { error: null, saved: true };
}

/** Puts an order on the customer page, snapshotting its Cash Flow data. */
export async function sendOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await locked();
  if (denied) return denied;

  const paymentId = String(formData.get('paymentId') ?? '').trim();
  if (!paymentId) return failure('Missing payment id.');

  try {
    const order = await fetchPaymentOrder(paymentId);
    if (!order) return failure('That payment order no longer exists.');

    await upsertSentOrder({
      paymentId: order.id,
      customerName: order.customerName,
      phone: order.phone,
      amountCad: order.amountCad,
      amountInr: order.amountInr,
      createdAt: order.createdAt,
    });
  } catch (e) {
    return failure(toMessage(e, 'Could not send the order.'));
  }

  revalidateOrderPages(paymentId);
  return { error: null, saved: true };
}

/** Edits what customers see on an already-sent order. */
export async function updateSentOrder(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const denied = await locked();
  if (denied) return denied;

  const paymentId = String(formData.get('paymentId') ?? '').trim();
  const customerName = String(formData.get('customerName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!paymentId || !customerName || !phone) {
    return failure('Customer name and phone are required.');
  }

  try {
    const sent = await fetchSentOrder(paymentId);
    if (!sent) return failure('This order is not on the customer page any more.');

    // Amounts stay as snapshotted; the payout customers see lives in bank_details.
    await upsertSentOrder({
      paymentId,
      customerName,
      phone,
      amountCad: sent.amountCad,
      amountInr: sent.amountInr,
      createdAt: sent.createdAt,
    });
  } catch (e) {
    return failure(toMessage(e, 'Could not update the order.'));
  }

  revalidateOrderPages(paymentId);
  return { error: null, saved: true };
}

/** Takes an order off the customer page again. */
export async function unsendOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await locked();
  if (denied) return denied;

  const paymentId = String(formData.get('paymentId') ?? '').trim();
  if (!paymentId) return failure('Missing payment id.');

  try {
    await deleteSentOrder(paymentId);
  } catch (e) {
    return failure(toMessage(e, 'Could not remove the order.'));
  }

  revalidateOrderPages(paymentId);
  return { error: null, saved: true };
}

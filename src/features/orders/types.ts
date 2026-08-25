export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'advance';

/** A payment order pulled from the Cash Flow API. */
export type PaymentOrder = {
  id: string;
  customerName: string;
  phone: string;
  amountCad: number;
  /** CAD→INR rate locked when the payment was recorded. */
  rateInr: number;
  amountInr: number;
  paidCad: number;
  paymentStatus: PaymentStatus;
  balanceCad: number;
  balanceInr: number;
  delivered: boolean;
  deliveredAt: string | null;
  remark?: string;
  /** ISO timestamp, used to sort the list newest first. */
  createdAt: string;
};

/** Payout bank account attached to a payment order, stored in Supabase. */
export type BankDetails = {
  paymentId: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName?: string;
  /**
   * Payout amount in INR, typed by the admin rather than taken from the Cash
   * Flow API. This is the only amount customers see.
   */
  amountInr: number;
  updatedAt: string;
};

export type BankDetailsInput = Omit<BankDetails, 'updatedAt'>;

/**
 * Snapshot of a payment order the admin sent to the customer orders page,
 * stored in Supabase. Customers only ever see these — never the Cash Flow
 * API data directly — and the admin can edit the snapshot after sending.
 */
export type SentOrder = {
  paymentId: string;
  customerName: string;
  phone: string;
  amountCad: number;
  amountInr: number;
  /** When the payment was recorded — the date shown to customers. */
  createdAt: string;
  sentAt: string;
};

export type SentOrderInput = Omit<SentOrder, 'sentAt'>;

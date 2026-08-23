export type Order = {
  id: string;
  /** Human readable name of the order, e.g. "Steel bolts - March". */
  name: string;
  /** Account number the order is booked against. */
  accountNo: string;
  /** Optional delivery address. */
  address?: string;
  /** ISO timestamp, used to sort the history newest first. */
  createdAt: string;
};

export type NewOrder = Omit<Order, 'id' | 'createdAt'>;

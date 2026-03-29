export interface Transaction {
  id: number;
  user_id: number;
  type: 'expense' | 'refund';
  amount: string;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  category_id: number | null;
}

export interface CreateTransactionPayload {
  type: 'expense' | 'refund';
  amount: string;
  description: string;
  transaction_date: string;
  category_id: number | null;
}

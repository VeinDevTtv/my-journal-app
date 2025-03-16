export interface Transaction {
    id: string;
    date: string;
    amount: number;
    category: string;
    description: string;
    recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  }
  
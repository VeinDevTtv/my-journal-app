export interface Transaction {
    id: string;
    date: string;
    amount: number; // Positive for income, negative for expense
    category: string;
    description: string;
  }
  
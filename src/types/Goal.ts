export interface Goal {
  id: string;
  description: string;
  targetAmount: number;
  deadline: string; // ISO string
  goalCategory?: string; // e.g., "Income", "Trading Profit"
  // currentAmount is now computed dynamically – no need to store it
}

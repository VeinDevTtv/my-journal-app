import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StorageService } from '../services/storageService';
import { Transaction } from '../types/Transaction';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

const SpendingTrend: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const transactions: Transaction[] = StorageService.getTransactions();
    const monthlyMap: { [month: string]: MonthlyData } = {};

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }
      if (tx.amount > 0) {
        monthlyMap[monthKey].income += tx.amount;
      } else {
        monthlyMap[monthKey].expense += Math.abs(tx.amount);
      }
    });

    const monthlyData = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
    setData(monthlyData);
  }, []);

  return (
    <div>
      <h3>Spending Trend: Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#82ca9d" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#8884d8" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTrend;

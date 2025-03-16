import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, LinearProgress, Box } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Transaction } from '../types/Transaction';
import { JournalEntry } from '../types/JournalEntry';
import { Goal } from '../types/Goal';
import { StorageService } from '../services/storageService';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const txs = StorageService.getTransactions();
    setTransactions(txs);
    calculateMetrics(txs);

    const journals = StorageService.getJournalEntries();
    setJournalEntries(journals);

    const goalsData = StorageService.getGoals();
    setGoals(goalsData);
  }, []);

  const calculateMetrics = (txs: Transaction[]) => {
    const totalIncome = txs.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = txs.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
    setIncome(totalIncome);
    setExpense(totalExpense);
  };

  // Transaction Overview Chart Data
  const transactionChartData = {
    labels: transactions.map(tx => new Date(tx.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Amount',
        data: transactions.map(tx => tx.amount),
        backgroundColor: transactions.map(tx =>
          tx.amount > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
      },
    ],
  };

  // Journal Tag Analytics: count frequency of each tag
  const tagFrequency: { [tag: string]: number } = {};
  journalEntries.forEach(entry => {
    if (entry.tags) {
      entry.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    }
  });
  const journalTagLabels = Object.keys(tagFrequency);
  const journalTagData = Object.values(tagFrequency);
  const journalTagChartData = {
    labels: journalTagLabels,
    datasets: [
      {
        data: journalTagData,
        backgroundColor: journalTagLabels.map(() => {
          // Generate random colors
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          return `rgba(${r}, ${g}, ${b}, 0.6)`;
        }),
      },
    ],
  };

  // Transaction Category Analytics: sum expenses by category (only expenses)
  const categorySums: { [category: string]: number } = {};
  transactions.forEach(tx => {
    if (tx.amount < 0) {
      categorySums[tx.category] = (categorySums[tx.category] || 0) + Math.abs(tx.amount);
    }
  });
  const transactionCategoryLabels = Object.keys(categorySums);
  const transactionCategoryData = Object.values(categorySums);
  const transactionCategoryChartData = {
    labels: transactionCategoryLabels,
    datasets: [
      {
        label: 'Expenses',
        data: transactionCategoryData,
        backgroundColor: transactionCategoryLabels.map(() => 'rgba(255, 159, 64, 0.6)'),
      },
    ],
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        {/* Income & Expense Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4" color="green">
                ${income.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4" color="red">
                ${Math.abs(expense).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Transaction Overview Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Transaction Overview</Typography>
              <Bar data={transactionChartData} />
            </CardContent>
          </Card>
        </Grid>
        {/* Goals & Milestones */}
        {goals.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Goals & Milestones</Typography>
                {goals.map(goal => {
                  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                  return (
                    <Box key={goal.id} mb={2}>
                      <Typography variant="subtitle1">{goal.description}</Typography>
                      <LinearProgress variant="determinate" value={progress} />
                      <Typography variant="caption">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        )}
        {/* Journal Tag Analytics */}
        {journalTagLabels.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Journal Tag Analytics</Typography>
                <Doughnut data={journalTagChartData} />
              </CardContent>
            </Card>
          </Grid>
        )}
        {/* Transaction Category Analytics */}
        {transactionCategoryLabels.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Transaction Category Analytics</Typography>
                <Bar data={transactionCategoryChartData} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Dashboard;

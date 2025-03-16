import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, LinearProgress, Box } from '@mui/material';
import { Transaction } from '../types/Transaction';
import { StorageService } from '../services/storageService';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Goal } from '../types/Goal';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const txs = StorageService.getTransactions();
    setTransactions(txs);
    calculateMetrics(txs);
    const goalsData = StorageService.getGoals();
    setGoals(goalsData);
  }, []);

  const calculateMetrics = (txs: Transaction[]) => {
    const totalIncome = txs.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = txs.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
    setIncome(totalIncome);
    setExpense(totalExpense);
  };

  const chartData = {
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

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
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
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Transaction Overview</Typography>
              <Bar data={chartData} />
            </CardContent>
          </Card>
        </Grid>
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
      </Grid>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Stack, Button, TextField, Grid, MenuItem, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Transaction } from '../types/Transaction';
import { StorageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const categories = [
  'Income',
  'Expense',
  'Savings',
  'Investment',
  'Trading Profit'
];

const TransactionList: React.FC = () => {
  const { notify } = useContext(NotificationContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  // Filter state variables
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All'); // Options: "All", "Income", "Expense"

  useEffect(() => {
    const txs = StorageService.getTransactions();
    setTransactions(txs);
    setFilteredTransactions(txs);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(tx => new Date(tx.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(tx => new Date(tx.date) <= new Date(endDate));
    }

    // Filter by category
    if (filterCategory !== 'All') {
      filtered = filtered.filter(tx => tx.category === filterCategory);
    }

    // Filter by type: Income or Expense
    if (filterType !== 'All') {
      if (filterType === 'Income') {
        filtered = filtered.filter(tx => tx.amount > 0);
      } else if (filterType === 'Expense') {
        filtered = filtered.filter(tx => tx.amount < 0);
      }
    }

    setFilteredTransactions(filtered);
  }, [startDate, endDate, filterCategory, filterType, transactions]);

  const handleDelete = (id: string) => {
    StorageService.deleteTransaction(id);
    const updated = StorageService.getTransactions();
    setTransactions(updated);
    notify('Transaction deleted successfully!', 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Transactions</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/transactions/new')}>
          New Transaction
        </Button>
      </Stack>
      <List>
        {filteredTransactions.map((tx) => (
          <ListItem key={tx.id} divider>
            <ListItemText
              primary={`${tx.category} - $${tx.amount.toFixed(2)} ${tx.recurrence && tx.recurrence !== 'none' ? `(${tx.recurrence})` : ''}`}
              secondary={`${new Date(tx.date).toLocaleString()} - ${tx.description}`}
            />
            <IconButton onClick={() => navigate(`/transactions/edit/${tx.id}`)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(tx.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </motion.div>
  );
};

export default TransactionList;

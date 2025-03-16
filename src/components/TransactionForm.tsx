import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Transaction } from '../types/Transaction';
import { StorageService } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

const categories = [
  'Income',
  'Expense',
  'Savings',
  'Investment',
  'Trading Profit'
];

const TransactionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 16));
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>(categories[0]);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (id) {
      const transactions = StorageService.getTransactions();
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        setDate(tx.date.substring(0, 16));
        setAmount(tx.amount);
        setCategory(tx.category);
        setDescription(tx.description);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tx: Transaction = {
      id: id ? id : uuidv4(),
      date: new Date(date).toISOString(),
      amount,
      category,
      description,
    };

    if (id) {
      StorageService.updateTransaction(tx);
    } else {
      StorageService.addTransaction(tx);
    }
    navigate('/transactions');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Date & Time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <Button type="submit" variant="contained" color="primary">
          {id ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </Stack>
    </form>
  );
};

export default TransactionForm;

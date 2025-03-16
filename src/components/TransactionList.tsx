import React, { useState, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Stack, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Transaction } from '../types/Transaction';
import { StorageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const TransactionList: React.FC = () => {
  const { notify } = useContext(NotificationContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTransactions(StorageService.getTransactions());
  }, []);

  const handleDelete = (id: string) => {
    StorageService.deleteTransaction(id);
    setTransactions(StorageService.getTransactions());
    notify('Transaction deleted successfully!', 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Transactions</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/transactions/new')}>
            New Transaction
          </Button>
        </Stack>
        <List>
          {transactions.map((tx) => (
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
      </div>
    </motion.div>
  );
};

export default TransactionList;

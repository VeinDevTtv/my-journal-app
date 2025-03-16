import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Typography, List, ListItem, IconButton, ListItemText, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Goal } from '../types/Goal';
import { StorageService } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';
import LinearProgress from '@mui/material/LinearProgress';

const goalCategories = [
  { value: 'Income', label: 'Income' },
  { value: 'Trading Profit', label: 'Trading Profit' }
];

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  // Fields for adding a new goal
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>(new Date().toISOString().substring(0, 10));
  const [goalCategory, setGoalCategory] = useState<string>('Income');

  useEffect(() => {
    setGoals(StorageService.getGoals());
  }, []);

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: uuidv4(),
      description,
      targetAmount,
      deadline: new Date(deadline).toISOString(),
      goalCategory, // Link this goal to a specific category
    };
    StorageService.addGoal(newGoal);
    setGoals(StorageService.getGoals());
    // Reset form fields
    setDescription('');
    setTargetAmount(0);
    setDeadline(new Date().toISOString().substring(0, 10));
    setGoalCategory('Income');
  };

  const handleDeleteGoal = (id: string) => {
    StorageService.deleteGoal(id);
    setGoals(StorageService.getGoals());
  };

  // Get all transactions to compute goal progress automatically
  const transactions = StorageService.getTransactions();

  // Compute current amount for a given goal based on its category
  const computeCurrentAmount = (goal: Goal): number => {
    if (goal.goalCategory) {
      // Sum up all positive transactions that match the goal category.
      const sum = transactions
        .filter(tx => tx.category === goal.goalCategory && tx.amount > 0)
        .reduce((acc, tx) => acc + tx.amount, 0);
      return sum;
    }
    return 0;
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Goals & Milestones</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Target Amount"
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
        />
        <TextField
          select
          label="Goal Category"
          value={goalCategory}
          onChange={(e) => setGoalCategory(e.target.value)}
        >
          {goalCategories.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" color="primary" onClick={handleAddGoal}>
          Add Goal
        </Button>
      </Stack>
      <List>
        {goals.map((goal) => {
          const current = computeCurrentAmount(goal);
          const progress = Math.min((current / goal.targetAmount) * 100, 100);
          return (
            <ListItem key={goal.id} divider>
              <ListItemText
                primary={`${goal.description} (${goal.goalCategory})`}
                secondary={`Deadline: ${new Date(goal.deadline).toLocaleDateString()}`}
              />
              <div style={{ width: '30%', marginRight: '16px' }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="caption">
                  ${current.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                </Typography>
              </div>
              <IconButton onClick={() => handleDeleteGoal(goal.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};

export default Goals;

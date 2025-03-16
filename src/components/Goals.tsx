import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Typography, List, ListItem, IconButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Goal } from '../types/Goal';
import { StorageService } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';
import LinearProgress from '@mui/material/LinearProgress';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    setGoals(StorageService.getGoals());
  }, []);

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: uuidv4(),
      description,
      targetAmount,
      currentAmount,
      deadline: new Date(deadline).toISOString(),
    };
    StorageService.addGoal(newGoal);
    setGoals(StorageService.getGoals());
    setDescription('');
    setTargetAmount(0);
    setCurrentAmount(0);
  };

  const handleDeleteGoal = (id: string) => {
    StorageService.deleteGoal(id);
    setGoals(StorageService.getGoals());
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Goals & Milestones</Typography>
      <Stack direction="row" spacing={2}>
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
          label="Current Amount"
          type="number"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(parseFloat(e.target.value))}
        />
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
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <ListItem key={goal.id} divider>
              <ListItemText
                primary={goal.description}
                secondary={`Deadline: ${new Date(goal.deadline).toLocaleDateString()}`}
              />
              <div style={{ width: '30%', marginRight: '16px' }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="caption">
                  ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
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

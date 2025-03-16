import React, { useState, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Stack, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { JournalEntry } from '../types/JournalEntry';
import { StorageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const JournalList: React.FC = () => {
  const { notify } = useContext(NotificationContext);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setEntries(StorageService.getJournalEntries());
  }, []);

  const handleDelete = (id: string) => {
    StorageService.deleteJournalEntry(id);
    setEntries(StorageService.getJournalEntries());
    notify('Journal deleted successfully!', 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Journal Entries</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/journal/new')}>
            New Entry
          </Button>
        </Stack>
        <List>
          {entries.map((entry) => (
            <ListItem key={entry.id} divider>
              <ListItemText
                primary={entry.title}
                secondary={`${new Date(entry.date).toLocaleString()} - ${entry.content.substring(0, 100)}...`}
              />
              <IconButton onClick={() => navigate(`/journal/edit/${entry.id}`)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(entry.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    </motion.div>
  );
};

export default JournalList;

import React, { useState, useEffect, useContext } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Stack, Button, TextField, Grid, MenuItem, Paper } from '@mui/material';
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
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const navigate = useNavigate();

  // Filter state variables
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const allEntries = StorageService.getJournalEntries();
    setEntries(allEntries);
    setFilteredEntries(allEntries);
  }, []);

  // Get all unique tags for the filter dropdown
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])));

  useEffect(() => {
    let filtered = entries;

    // Filter by keyword in title or content
    if (keyword.trim() !== '') {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(keyword.toLowerCase()) ||
        entry.content.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Filter by start date
    if (startDate) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(startDate));
    }

    // Filter by end date
    if (endDate) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(endDate));
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(entry => entry.tags && entry.tags.includes(selectedTag));
    }

    setFilteredEntries(filtered);
  }, [keyword, startDate, endDate, selectedTag, entries]);

  const handleDelete = (id: string) => {
    StorageService.deleteJournalEntry(id);
    const updatedEntries = StorageService.getJournalEntries();
    setEntries(updatedEntries);
    notify('Journal deleted successfully!', 'info');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Grid>
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
              label="Tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {allTags.map(tag => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Journal Entries</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/journal/new')}>
          New Entry
        </Button>
      </Stack>
      <List>
        {filteredEntries.map((entry) => (
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
    </motion.div>
  );
};

export default JournalList;

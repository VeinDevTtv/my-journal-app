import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { JournalEntry } from '../types/JournalEntry';
import { StorageService } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const JournalEntryForm: React.FC = () => {
  const { notify } = useContext(NotificationContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 16));
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if (id) {
      const entries = StorageService.getJournalEntries();
      const entry = entries.find(e => e.id === id);
      if (entry) {
        setDate(entry.date.substring(0, 16));
        setTitle(entry.title);
        setContent(entry.content);
        setTags(entry.tags ? entry.tags.join(', ') : '');
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      id: id ? id : uuidv4(),
      date: new Date(date).toISOString(),
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    if (id) {
      StorageService.updateJournalEntry(entry);
      notify('Journal updated successfully!', 'success');
    } else {
      StorageService.addJournalEntry(entry);
      notify('Journal added successfully!', 'success');
    }
    navigate('/journal');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={6}
            required
          />
          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Update Entry' : 'Add Entry'}
          </Button>
        </Stack>
      </form>
    </motion.div>
  );
};

export default JournalEntryForm;

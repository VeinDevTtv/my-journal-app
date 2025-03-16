import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { JournalEntry } from '../types/JournalEntry';
import { StorageService } from '../services/storageService';

const PromptRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const journals = StorageService.getJournalEntries();
    // Filter journals for the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthJournals = journals.filter(entry => {
      const date = new Date(entry.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Count frequency of tags in current month
    const tagFrequency: { [tag: string]: number } = {};
    currentMonthJournals.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      }
    });

    const newRecommendations: string[] = [];
    const threshold = 5; // threshold for recommendation
    for (const tag in tagFrequency) {
      if (tagFrequency[tag] >= threshold) {
        newRecommendations.push(
          `You’ve written about '${tag}' ${tagFrequency[tag]} times this month — consider a related journaling prompt or wellness goal.`
        );
      }
    }

    setRecommendations(newRecommendations);
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h6">Journal Recommendations</Typography>
      {recommendations.map((rec, idx) => (
        <Typography key={idx} variant="body1">
          {rec}
        </Typography>
      ))}
    </Paper>
  );
};

export default PromptRecommendations;

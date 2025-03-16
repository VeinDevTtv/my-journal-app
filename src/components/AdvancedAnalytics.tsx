import React from 'react';
import { Paper, Grid } from '@mui/material';
import JournalHeatmap from './JournalHeatmap';
import SpendingTrend from './SpendingTrend';

const AdvancedAnalytics: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <JournalHeatmap />
        </Grid>
        <Grid item xs={12} md={6}>
          <SpendingTrend />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdvancedAnalytics;

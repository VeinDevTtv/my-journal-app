import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { StorageService } from '../services/storageService';

// Define a type for the heatmap values
interface HeatmapValue {
  date: string;
  count: number;
}

const JournalHeatmap: React.FC = () => {
  const journals = StorageService.getJournalEntries();

  // Count journal entries per date
  const dateCount: { [date: string]: number } = {};
  journals.forEach(entry => {
    const dateStr = new Date(entry.date).toISOString().split('T')[0];
    dateCount[dateStr] = (dateCount[dateStr] || 0) + 1;
  });

  const values: HeatmapValue[] = Object.keys(dateCount).map(date => ({
    date,
    count: dateCount[date],
  }));

  // Set start and end dates (past year)
  const endDate = new Date().toISOString().split('T')[0];
  const startDateObj = new Date();
  startDateObj.setFullYear(startDateObj.getFullYear() - 1);
  const startDate = startDateObj.toISOString().split('T')[0];

  return (
    <div>
      <h3>Journal Activity Heatmap</h3>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value: HeatmapValue | null): string => {
          if (!value) {
            return 'color-empty';
          }
          if (value.count >= 4) {
            return 'color-github-4';
          } else if (value.count >= 2) {
            return 'color-github-2';
          }
          return 'color-github-1';
        }}
        tooltipDataAttrs={(value: HeatmapValue | null): { [key: string]: string } =>
          value && value.date
            ? { 'data-tip': `${value.date}: ${value.count} entries` }
            : {}
        }
      />
    </div>
  );
};

export default JournalHeatmap;

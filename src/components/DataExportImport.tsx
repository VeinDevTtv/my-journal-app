import React, { useRef } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { StorageService } from '../services/storageService';
import { JournalEntry } from '../types/JournalEntry';
import { Transaction } from '../types/Transaction';
import { Goal } from '../types/Goal';

const DataExportImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const data = {
      journals: StorageService.getJournalEntries(),
      transactions: StorageService.getTransactions(),
      goals: StorageService.getGoals(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const journals: JournalEntry[] = StorageService.getJournalEntries();
    const transactions: Transaction[] = StorageService.getTransactions();
    const goals: Goal[] = StorageService.getGoals();

    let csvContent = "data:text/csv;charset=utf-8,";

    // Journals Section
    csvContent += "=== JOURNALS ===\n";
    csvContent += "ID,Date,Title,Content,Tags\n";
    journals.forEach(entry => {
      csvContent += `"${entry.id}","${entry.date}","${entry.title}","${entry.content.replace(/"/g, '""')}","${entry.tags ? entry.tags.join('|') : ''}"\n`;
    });

    // Transactions Section
    csvContent += "\n=== TRANSACTIONS ===\n";
    csvContent += "ID,Date,Amount,Category,Description,Recurrence\n";
    transactions.forEach(tx => {
      csvContent += `"${tx.id}","${tx.date}",${tx.amount},"${tx.category}","${tx.description.replace(/"/g, '""')}","${tx.recurrence || 'none'}"\n`;
    });

    // Goals Section
    csvContent += "\n=== GOALS ===\n";
    csvContent += "ID,Description,TargetAmount,Deadline,GoalCategory\n";
    goals.forEach(goal => {
      csvContent += `"${goal.id}","${goal.description.replace(/"/g, '""')}",${goal.targetAmount},"${goal.deadline}","${goal.goalCategory || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = 'data-export.csv';
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.journals) {
          StorageService.saveJournalEntries(data.journals);
        }
        if (data.transactions) {
          StorageService.saveTransactions(data.transactions);
        }
        if (data.goals) {
          StorageService.saveGoals(data.goals);
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Export / Import Data</Typography>
      <Button variant="contained" color="primary" onClick={exportJSON}>
        Export as JSON
      </Button>
      <Button variant="contained" color="primary" onClick={exportCSV}>
        Export as CSV
      </Button>
      <Button variant="contained" color="secondary" onClick={() => fileInputRef.current?.click()}>
        Import Data (JSON)
      </Button>
      <input
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImport}
      />
    </Stack>
  );
};

export default DataExportImport;

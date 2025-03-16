import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import JournalList from './components/JournalList';
import JournalEntryForm from './components/JournalEntryForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<JournalList />} />
          <Route path="/journal/new" element={<JournalEntryForm />} />
          <Route path="/journal/edit/:id" element={<JournalEntryForm />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/new" element={<TransactionForm />} />
          <Route path="/transactions/edit/:id" element={<TransactionForm />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, createTheme, ThemeProvider, SpeedDial, SpeedDialAction } from '@mui/material';
import { Add as AddIcon, NoteAdd as NoteAddIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import JournalList from './components/JournalList';
import JournalEntryForm from './components/JournalEntryForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import DataExportImport from './components/DataExportImport';
import Goals from './components/Goals';
import Reminders from './components/Reminders';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<string>('#1976d2');

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: accentColor },
      },
    }), [darkMode, accentColor]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
  };

  // SpeedDial actions for quick add
  const actions = [
    { icon: <NoteAddIcon />, name: 'New Journal', route: '/journal/new' },
    { icon: <AttachMoneyIcon />, name: 'New Transaction', route: '/transactions/new' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header darkMode={darkMode} toggleTheme={toggleTheme} onAccentChange={handleAccentColorChange} accentColor={accentColor} />
        <Container sx={{ marginTop: 4, position: 'relative', minHeight: '80vh' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Dashboard />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/journal" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <JournalList />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/journal/new" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <JournalEntryForm />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/journal/edit/:id" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <JournalEntryForm />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TransactionList />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/transactions/new" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TransactionForm />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/transactions/edit/:id" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TransactionForm />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/data" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DataExportImport />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/goals" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Goals />
                </motion.div>
              </PrivateRoute>
            } />
            <Route path="/reminders" element={
              <PrivateRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Reminders />
                </motion.div>
              </PrivateRoute>
            } />
          </Routes>
          {/* Floating SpeedDial for quick add actions */}
          <SpeedDial
            ariaLabel="Quick Add"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<AddIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => window.location.assign(action.route)}
              />
            ))}
          </SpeedDial>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;

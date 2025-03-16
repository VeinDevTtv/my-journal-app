import React, { useState, useContext } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { user } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleReset = () => {
    const registeredUserStr = localStorage.getItem('registeredUser');
    if (!registeredUserStr) {
      notify('No registered user found.', 'error');
      return;
    }
    const registeredUser = JSON.parse(registeredUserStr);
    if (registeredUser.email !== email) {
      notify('Email does not match our records.', 'error');
      return;
    }
    // Update password
    registeredUser.password = newPassword;
    localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
    notify('Password reset successfully!', 'success');
    navigate('/login');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack spacing={2} sx={{ maxWidth: 400, margin: 'auto', marginTop: 8 }}>
        <Typography variant="h4" textAlign="center">
          Reset Password
        </Typography>
        <TextField
          label="Registered Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button variant="contained" onClick={handleReset}>
          Reset Password
        </Button>
      </Stack>
    </motion.div>
  );
};

export default ForgotPassword;

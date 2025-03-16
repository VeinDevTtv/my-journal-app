import React, { useState, useContext } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (login(email, password)) {
      notify('Login successful!', 'success');
      navigate('/');
    } else {
      notify('Invalid credentials', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack spacing={2} sx={{ maxWidth: 400, margin: 'auto', marginTop: 8 }}>
        <Typography variant="h4" textAlign="center">Login</Typography>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button variant="contained" onClick={handleLogin}>Login</Button>
        <Typography variant="body2" textAlign="center">
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Stack>
    </motion.div>
  );
};

export default Login;

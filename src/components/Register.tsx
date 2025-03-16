import React, { useState, useContext } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (register(email, password)) {
      notify('Registration successful!', 'success');
      navigate('/');
    } else {
      notify('User already exists', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack spacing={2} sx={{ maxWidth: 400, margin: 'auto', marginTop: 8 }}>
        <Typography variant="h4" textAlign="center">Register</Typography>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button variant="contained" onClick={handleRegister}>Register</Button>
        <Typography variant="body2" textAlign="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Stack>
    </motion.div>
  );
};

export default Register;

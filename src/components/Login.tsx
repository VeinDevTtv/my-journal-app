import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { AuthService } from '../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const success = await AuthService.login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Typography variant="body2">Don't have an account?</Typography>
          </Link>

          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2">Forgot Password?</Typography>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

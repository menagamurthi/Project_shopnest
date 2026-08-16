import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      toast.success('Logged in');
      if (data.user?.isAdmin) {
        navigate('/admin/products');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, pb: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" mb={3} align="center" sx={{ fontWeight: 800 }}>Login</Typography>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <Box component="form" onSubmit={submitHandler}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5, fontSize: 16 }}>LOGIN</Button>
          <Typography mt={2}>New? <Link to="/register">Register here</Link></Typography>
        </Box>
      </Paper>
    </Container>
  );
}
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, userInfo } = useAuth(); // get userInfo from context

  // If already logged in, kick to correct page
  useEffect(() => {
    if (userInfo) {
      if(userInfo.user?.isAdmin) {
        navigate('/admin/products');
      } else {
        navigate('/');
      }
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password); // This will update userInfo and trigger useEffect above
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" mb={3} align="center">Login</Typography>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <Box component="form" onSubmit={submitHandler}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} margin="normal" required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>LOGIN</Button>
          <Typography mt={2}>New? <Link to="/register">Register here</Link></Typography>
        </Box>
      </Paper>
    </Container>
  );
}
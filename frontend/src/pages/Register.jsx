import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../api'; // <-- using named export
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser(name, email, password);
      localStorage.setItem('userInfo', JSON.stringify(data)); // data already has {token, user}
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" mb={3} align="center">Register</Typography>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <Box component="form" onSubmit={submit}>
          <TextField fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} margin="normal" required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
          <Typography mt={2}>Already have account? <Link to="/login">Login</Link></Typography>
        </Box>
      </Paper>
    </Container>
  );
}
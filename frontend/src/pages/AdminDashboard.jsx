import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Inventory, ShoppingBag, People, CurrencyRupee } from '@mui/icons-material';
import API from '../api'; // ✅ KEEP THIS

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const user = userInfo?.user;

useEffect(() => {
  if(!userInfo || !user?.isAdmin){
    navigate('/login', { replace: true });
    return;
  }
  
  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats'); // <-- CHANGE THIS. NO config needed
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };
  fetchStats();
}, [userInfo, navigate]); // <-- ADD dependencies

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <Inventory fontSize="large" />, color: '#1976d2' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag fontSize="large" />, color: '#2e7d32' },
    { title: 'Total Users', value: stats.totalUsers, icon: <People fontSize="large" />, color: '#ed6c02' },
    { 
      title: 'Total Revenue', 
      value: (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <CurrencyRupee fontSize="large" />
          {Number(stats.totalRevenue || 0).toFixed(2)}
        </Box>
      ), 
      color: '#9c27b0'  
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: card.color, color: 'white' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <div>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="h4">{card.value || 0}</Typography>
                  </div>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
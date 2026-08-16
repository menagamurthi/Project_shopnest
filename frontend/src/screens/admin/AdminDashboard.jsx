import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Inventory, ShoppingCart, People, CurrencyRupee } from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const token = userInfo?.user?.token || userInfo?.token;
  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [pRes, oRes, uRes] = await Promise.all([
          API.get('/products/count', config),
          API.get('/orders/stats', config),
          API.get('/users/count', config),
        ]);

        setStats({
          products: pRes.data.count,
          orders: oRes.data.totalOrders,
          users: uRes.data.count,
          revenue: oRes.data.totalSales,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo, token, isAdmin, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const summaryCards = [
    { title: 'Total Products', value: stats.products, icon: <Inventory fontSize="large" />, color: '#2563eb' },
    { title: 'Total Orders', value: stats.orders, icon: <ShoppingCart fontSize="large" />, color: '#16a34a' },
    { title: 'Total Users', value: stats.users, icon: <People fontSize="large" />, color: '#f59e0b' },
    { title: 'Total Revenue', value: `₹${Number(stats.revenue || 0).toFixed(2)}`, icon: <CurrencyRupee fontSize="large" />, color: '#ef4444' },
  ];

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', transition: 'all 0.3s ease', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' } }}>
              <Box sx={{ background: card.color, color: '#fff', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 16 } }}>{card.title}</Typography>
                <Box sx={{ opacity: 0.8 }}>{card.icon}</Box>
              </Box>
              <CardContent sx={{ pt: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
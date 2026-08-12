import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Chip, CircularProgress, Grid } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(!userInfo) return navigate('/login');
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await API.get('/orders/myorders', config);
        setOrders(data);
      } catch(err) {
        console.log(err);
        alert('Failed to load orders')
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) return <Container sx={{ mt: 4, textAlign:'center' }}><CircularProgress /></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>My Orders</Typography>
      
      {orders.length === 0 ? (
        <Typography>No orders found</Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper 
                sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography><b>Order:</b> #{order._id.substring(0,8)}</Typography>
                  <Box>
                    {order.isPaid ? (
                      <Chip label="PAID" color="success" size="small" sx={{mr:1}} />
                    ) : (
                      <Chip label="NOT PAID" color="error" size="small" sx={{mr:1}} />
                    )}
                    <Chip 
                      label={order.orderStatus || 'Processing'} 
                      color={order.orderStatus === 'Delivered' ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </Box>
                </Box>
                <Typography><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                <Typography><b>Total:</b> ₹{order.totalPrice}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
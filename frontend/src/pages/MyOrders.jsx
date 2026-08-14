import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Chip, CircularProgress, Grid, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import API from '../api'; // Assuming you have axios instance here

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchOrders = async () => {
    if(!userInfo) return navigate('/login');
    try {
      setLoading(true);
      const { data } = await API.get('/orders/myorders'); 
      setOrders(data);
    } catch(err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderHandler = async (id) => {
    if(window.confirm('Are you sure you want to cancel this order?')){
      try {
        await API.delete(`/orders/${id}`); 
        toast.success('Order Cancelled');
        fetchOrders(); // refresh list
      } catch(err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  if (loading) return <Container sx={{ mt: 4, textAlign:'center' }}><CircularProgress /></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>My Orders</Typography>

      {orders.length === 0? (
        <Typography>No orders found</Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Paper sx={{ p: 2, '&:hover': { boxShadow: 6 } }}>
                <Box sx={{ cursor: 'pointer' }} onClick={() => navigate(`/order/${order._id}`)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography><b>Order:</b> #{order._id.substring(0,8)}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={order.isPaid? "PAID" : "NOT PAID"} color={order.isPaid? "success" : "error"} size="small" />
                      <Chip label={order.orderStatus || 'Processing'} color={order.orderStatus === 'Delivered'? 'success' : 'warning'} size="small" />
                    </Stack>
                  </Box>
                  <Typography><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                  <Typography><b>Total:</b> ₹{order.totalPrice}</Typography>
                </Box>
                
                {/* CANCEL BUTTON - ONLY FOR UNPAID */}
                {!order.isPaid && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    fullWidth 
                    sx={{mt: 2}}
                    startIcon={<DeleteIcon />}
                    onClick={() => cancelOrderHandler(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
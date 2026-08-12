import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Button, Divider, Chip, CircularProgress } from '@mui/material'; 
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false); 
  const { id } = useParams();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 

  useEffect(() => {
    if(!userInfo) return navigate('/login');
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await API.get(`/orders/${id}`, config);
        setOrder(data);
      } catch(err) {
        console.log(err);
        alert(err.response?.data?.message || 'Failed to load order')
        navigate('/login')
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleRazorpayPayment = async () => {
    if(!window.Razorpay) {
      alert('Razorpay SDK not loaded. Refresh page.')
      return;
    }
    setPayLoading(true);
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    try {
      // 1. Create Razorpay order from backend
      const { data: razorpayOrder } = await API.post(`/orders/${order._id}/pay`, {}, config);

      // 2. Open Razorpay Checkout
      const options = {		
        key: "rzp_test_TLjUJVZLU26CPR", // your key_id
        amount: razorpayOrder.amount, // in paise
        currency: "INR",
        name: "ShopNest",
        description: `Order #${order._id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3. Verify payment with REAL response
          try {
            await API.post(`/orders/${order._id}/verify`, response, config);
            alert('Payment Successful!');
            // Refresh order
            const { data } = await API.get(`/orders/${id}`, config);
            setOrder(data);
          } catch(err) {
            alert('Verification failed: ' + err.response?.data?.message)
          } finally {
            setPayLoading(false);
          }
        },
        modal: { ondismiss: function(){ setPayLoading(false); } },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#1976d2" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response){
        alert('Payment Failed: ' + response.error.description);
        setPayLoading(false);
      });
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
      setPayLoading(false);
    }
  };

  // DELETE THIS LATER - FOR TESTING ONLY
  const handleFakePayment = async () => {
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    setPayLoading(true);
    try {
      const fakeResponse = {
        razorpay_payment_id: "pay_test_" + Date.now(),
        razorpay_order_id: "order_test_" + Date.now(),
        razorpay_signature: "test_signature"
      }
      await API.post(`/orders/${order._id}/verify`, fakeResponse, config);
      alert('Payment Successful!');
      const { data } = await API.get(`/orders/${id}`, config);
      setOrder(data);
    } catch(err) {
      alert('Verification failed: ' + err.response?.data?.message)
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <Container sx={{ mt: 4, textAlign:'center' }}><CircularProgress /></Container>;
  if (!order) return <Container sx={{ mt: 4 }}><Typography>Order not found</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/myorders')}>Back to Orders</Button>
      <Typography variant="h4" mt={2}>Order {order._id}</Typography>
      <Typography color="text.secondary">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" mb={2}>Order Items</Typography>
        <Divider />
        {order.orderItems?.map((item) => (
          <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
            <Typography>{item.name} x {item.qty}</Typography>
            <Typography>₹{item.price * item.qty}</Typography>
          </Box>
        ))}
        <Divider />
        <Typography variant="h5" sx={{ mt: 2, textAlign: 'right' }}>Total: ₹{order.totalPrice}</Typography>
        <Box sx={{ mt: 3 }}>
          {order.isPaid === false ? (
            <>
              {/* REAL RAZORPAY BUTTON */}
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleRazorpayPayment} 
                disabled={payLoading}
              >
                {payLoading ? 'Processing...' : `Pay Now ₹${order.totalPrice}`}
              </Button>

              {/* TEST BUTTON - Remove after testing */}
              <Button 
                variant="outlined" 
                color="success" 
                fullWidth 
                sx={{mt:1}} 
                onClick={handleFakePayment}
                disabled={payLoading}
              >
                Test: Mark as Paid
              </Button>
            </>
          ) : (
            <Chip label={`PAID on ${order.paidAt ? new Date(order.paidAt).toLocaleDateString() : ''}`} color="success" sx={{width: '100%', height: 48}} />
          )}
        </Box>
      </Paper>
    </Container>
  );
}
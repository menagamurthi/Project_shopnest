import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Button, Divider, Chip, CircularProgress, List, ListItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = userInfo?.token
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, { // FIXED URL
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if(!res.ok) throw new Error(data.message)
        setOrder(data)
      } catch (err) {
        toast.error(err.message)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [id, userInfo?.token])

  const handleRazorpayPayment = async () => {
    if(!window.Razorpay) {
      alert('Razorpay SDK not loaded. Refresh page.')
      return;
    }
    setPayLoading(true);
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order._id}/pay`, { // FIXED URL
        method: 'POST', headers: config.headers
      })
      const razorpayOrder = await res.json();
      const options = {	
        key: "rzp_test_TLjUJVZLU26CPR",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "ShopNest",
        description: `Order #${order._id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await fetch(`http://localhost:5000/api/orders/${order._id}/verify`, {
              method: 'POST', headers: {...config.headers, 'Content-Type': 'application/json'}, body: JSON.stringify(response)
            });
            toast.success('Payment Successful!');
            const res2 = await fetch(`http://localhost:5000/api/orders/${id}`, {headers: config.headers});
            setOrder(await res2.json());
          } catch(err) {
            toast.error('Verification failed')
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
        toast.error('Payment Failed: ' + response.error.description);
        setPayLoading(false);
      });
    } catch (err) {
      toast.error('Something went wrong');
      setPayLoading(false);
    }
  };

  if (loading) return <Container sx={{ mt: 4, textAlign:'center' }}><CircularProgress /></Container>;
  if (!order) return <Container sx={{ mt: 4 }}><Typography>Order not found</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/myorders')}>Back to Orders</Button>
      <Typography variant="h4" mt={2}>Order {order._id}</Typography>
      <Typography color="text.secondary">{order.createdAt? new Date(order.createdAt).toLocaleString() : ''}</Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" mb={2}>Shipping Address</Typography>
        <Typography>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</Typography>

        <Typography variant="h6" mt={3} mb={2}>Payment Method</Typography>
        <Chip label={order.paymentMethod} color={order.paymentMethod === 'COD'? 'warning' : 'info'} />
        {order.isPaid && <Chip label={`PAID on ${new Date(order.paidAt).toLocaleDateString()}`} color="success" sx={{ml:1}} />}

        <Typography variant="h6" mt={3} mb={2}>Order Items</Typography>
        <Divider />
        <List>
        {order.orderItems?.map((item) => (
          <ListItem key={item.product} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
              <img src={`http://localhost:5000/${item.image}`} alt={item.name} style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 4}}/>
              <Typography>{item.name} x {item.qty}</Typography>
            </Box>
            <Typography>₹{(item.price * item.qty).toFixed(2)}</Typography>
          </ListItem>
        ))}
        </List>
        <Divider />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography>Items: ₹{order.itemsPrice?.toFixed(2)}</Typography>
          <Typography>Shipping: ₹{order.shippingPrice?.toFixed(2)}</Typography>
          <Typography>Tax: ₹{order.taxPrice?.toFixed(2)}</Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>Total: ₹{order.totalPrice?.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          {order.paymentMethod === 'COD' &&!order.isPaid && (
            <Chip label="Pay Cash On Delivery" color="warning" sx={{width: '100%', height: 48, fontSize: 16}} />
          )}
          {order.paymentMethod === 'Razorpay' &&!order.isPaid && (
            <Button variant="contained" fullWidth onClick={handleRazorpayPayment} disabled={payLoading}>
              {payLoading? 'Processing...' : `Pay Now ₹${order.totalPrice}`}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
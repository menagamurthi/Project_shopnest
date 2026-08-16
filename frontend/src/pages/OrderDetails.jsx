import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Button, Divider, Chip, CircularProgress, List, ListItem, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError('');
        setLoading(true);
        console.log('Fetching order:', id);
        const { data } = await api.get(`/orders/${id}`);
        console.log('Order data:', data);
        setOrder(data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load order';
        console.error('Error fetching order:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) fetchOrder();
    else navigate('/login');
  }, [id, userInfo, navigate]);

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }

    setPayLoading(true);
    try {
      console.log('Creating Razorpay order for order:', order._id);
      const { data: razorpayOrder } = await api.post(`/orders/${order._id}/pay`);
      console.log('Razorpay order created:', razorpayOrder);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'ShopNest',
        description: `Order #${order._id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            console.log('Payment response received:', response);
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'test_signature'
            };
            console.log('Sending verification:', verificationData);
            await api.post(`/orders/${order._id}/verify`, verificationData);
            toast.success('Payment Successful!');
            const { data: orderData } = await api.get(`/orders/${id}`);
            console.log('Updated order after payment:', orderData);
            setOrder(orderData);
          } catch (err) {
            console.error('Verification error:', err.response?.data || err.message);
            toast.error('Verification failed: ' + (err.response?.data?.message || err.message));
          } finally {
            setPayLoading(false);
          }
        },
        modal: { 
          ondismiss: function () { 
            console.log('Razorpay modal dismissed');
            setPayLoading(false); 
          } 
        },
        prefill: { name: userInfo?.name, email: userInfo?.email },
        theme: { color: '#111827' },
      };

      console.log('Opening Razorpay with options:', options);
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response);
        toast.error('Payment Failed: ' + (response?.error?.description || 'Unknown error'));
        setPayLoading(false);
      });
    } catch (err) {
      console.error('Error initiating payment:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(errorMsg);
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, pb: 5, textAlign: 'center' }}>
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2 }}>Loading order details...</Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#6b7280' }}>Order ID: {id}</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, pb: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          ❌ Error: {error}
        </Alert>
        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#6b7280' }}>Order ID: {id}</Typography>
        <Button variant="contained" onClick={() => navigate('/myorders')} sx={{ mr: 2 }}>Back to Orders</Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>Reload Page</Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ mt: 4, pb: 5 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ Order not found in system
        </Alert>
        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#6b7280' }}>Requested Order ID: {id}</Typography>
        <Button variant="contained" onClick={() => navigate('/myorders')} sx={{ mr: 2 }}>Back to Orders</Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>Reload Page</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, pb: 5 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/myorders')} sx={{ mb: 3 }}>
        Back to Orders
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Order #{order._id?.substring(0, 10)}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date not available'}
      </Typography>

      <Paper sx={{ p: 3, mt: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Shipping Address</Typography>
        <Typography sx={{ mb: 3, color: '#6b7280' }}>
          {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Payment Method</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip 
            label={order.paymentMethod || 'N/A'} 
            color={order.paymentMethod === 'COD' ? 'warning' : 'info'} 
            icon={order.paymentMethod === 'COD' ? '💵' : '🔒'}
          />
          {order.isPaid && (
            <Chip 
              label={`PAID on ${new Date(order.paidAt).toLocaleDateString()}`} 
              color="success" 
              icon="✓"
            />
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Order Items</Typography>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ mb: 2 }}>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <ListItem key={item.product} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, px: 0, borderBottom: '1px solid #e5e7eb' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.image && (
                    <img src={item.image} alt={item.name} style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8 }} />
                  )}
                  <Typography>{item.name} x {item.qty}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>₹{(item.price * item.qty).toFixed(2)}</Typography>
              </ListItem>
            ))
          ) : (
            <Typography color="error">No items in order</Typography>
          )}
        </List>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f3f4f6', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Items:</Typography>
            <Typography sx={{ fontWeight: 600 }}>₹{order.itemsPrice?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Shipping:</Typography>
            <Typography sx={{ fontWeight: 600 }}>₹{order.shippingPrice?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Tax:</Typography>
            <Typography sx={{ fontWeight: 600 }}>₹{order.taxPrice?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Total:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>₹{order.totalPrice?.toFixed(2) || '0.00'}</Typography>
          </Box>
        </Box>

        {userInfo?.isAdmin && !order.isDelivered && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
            onClick={async () => {
              try {
                await api.put(`/orders/${order._id}/deliver`);
                toast.success('Order Marked as Delivered');
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
              } catch (err) {
                toast.error(err.response?.data?.message || 'Error updating order');
              }
            }}
          >
            Mark As Delivered
          </Button>
        )}

        <Box sx={{ mt: 3 }}>
          {order.paymentMethod === 'COD' && !order.isPaid && (
            <Chip 
              label="💵 Pay Cash On Delivery" 
              color="warning" 
              sx={{ width: '100%', height: 48, fontSize: 16, fontWeight: 700 }} 
            />
          )}
          {order.paymentMethod === 'Razorpay' && !order.isPaid && (
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleRazorpayPayment} 
              disabled={payLoading} 
              sx={{ py: 1.5, fontSize: 16, fontWeight: 700 }}
            >
              {payLoading ? '⏳ Processing...' : `🔒 Pay Now ₹${order.totalPrice?.toFixed(2) || '0.00'}`}
            </Button>
          )}
          {order.isPaid && (
            <Alert severity="success" sx={{ mt: 2 }}>
              ✓ Payment Completed - Order Status: {order.orderStatus || 'Processing'}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
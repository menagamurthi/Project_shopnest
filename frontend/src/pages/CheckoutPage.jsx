import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Paper, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';

const CheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartTotal;
  const taxPrice = itemsPrice * 0.18;
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  useEffect(() => {
    if (!userInfo) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=checkout');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    const shippingAddress = { address, city, postalCode, country };

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image.replace(/\\\\/g, '/'),
      price: item.price,
      product: item._id,
    }));

    console.log('Creating order with:', {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    try {
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      console.log('Order created:', data);
      clearCart();
      
      if (paymentMethod === 'Razorpay') {
        toast.success('Order Created! Proceed with Razorpay payment.');
        navigate(`/order/${data._id}`);
      } else {
        toast.success('Order Placed Successfully! Pay on Delivery.');
        navigate(`/order/${data._id}`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create order';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Checkout</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Shipping Address</Typography>
            <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Full Address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                fullWidth
                required 
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="City" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  required 
                  fullWidth 
                />
                <TextField 
                  label="Postal Code" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  required 
                  fullWidth
                />
              </Box>
              <TextField 
                label="Country" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                required 
              />

              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Payment Method</Typography>
                <RadioGroup 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  sx={{ mb: 3 }}
                >
                  <FormControlLabel 
                    value="COD" 
                    control={<Radio />} 
                    label={<Box><Typography variant="body1" sx={{ fontWeight: 600 }}>Cash on Delivery</Typography><Typography variant="caption" color="text.secondary">Pay when you receive your order</Typography></Box>}
                  />
                  <FormControlLabel 
                    value="Razorpay" 
                    control={<Radio />} 
                    label={<Box><Typography variant="body1" sx={{ fontWeight: 600 }}>Razorpay Payment</Typography><Typography variant="caption" color="text.secondary">Secure online payment via Razorpay</Typography></Box>}
                  />
                </RadioGroup>

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  size="large" 
                  disabled={loading} 
                  sx={{ py: 1.5, fontSize: 16, fontWeight: 700 }}
                >
                  {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : 'Place Order (Razorpay)'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Order Summary</Typography>
            
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f3f4f6', borderRadius: 2 }}>
              <Typography sx={{ mb: 1, fontSize: 14, color: '#6b7280' }}>Payment Method</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: paymentMethod === 'COD' ? '#f59e0b' : '#3b82f6' }}>
                {paymentMethod === 'COD' ? '💳 Cash on Delivery' : '🔒 Razorpay Payment'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
              <Typography sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Items ({cartItems.length}):</span>
                <span sx={{ fontWeight: 600 }}>₹{itemsPrice.toFixed(2)}</span>
              </Typography>
              <Typography sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax (18%):</span>
                <span sx={{ fontWeight: 600 }}>₹{taxPrice.toFixed(2)}</span>
              </Typography>
              <Typography sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping:</span>
                <span sx={{ fontWeight: 600, color: shippingPrice === 0 ? '#16a34a' : '#111827' }}>
                  {shippingPrice === 0 ? '🎉 FREE' : `₹${shippingPrice.toFixed(2)}`}
                </span>
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#111827' }}>
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
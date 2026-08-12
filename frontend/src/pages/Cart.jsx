import React, { useState } from 'react';
import { Container, Typography, Button, Box, Paper, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import API from '../api'; 

export default function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // for preventing double click

  const total = cart?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;

  const decreaseQty = (item) => {
    if(item.qty === 1) {
      removeFromCart(item._id); 
    } else {
      addToCart(item, -1); 
    }
  }

  const handleCheckout = async () => {
    if(loading) return; // prevent double click
    setLoading(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(!userInfo) {
      setLoading(false);
      return navigate('/login');
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const orderItems = cart.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }))

      const { data } = await API.post('/orders', {
        orderItems,
        shippingAddress: { 
          address: '123 Test St', 
          city: 'Chennai', 
          postalCode: '600001', 
          country: 'India' 
        },
        paymentMethod: 'Razorpay',
        itemsPrice: total,
        totalPrice: total,
      }, config);
      
      alert('Order Placed! ID: ' + data._id);
      clearCart();
      navigate(`/order/${data._id}`); // Go to OrderDetails
      
    } catch (err) {
      console.log(err.response)
      alert(err.response?.data?.message || 'Checkout failed');
      setLoading(false); // reset on error
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Shopping Cart</Typography>
      
      {cart.length === 0 ? (
        <Typography>Cart is empty</Typography> 
      ) : (
        cart.map(item => (
          <Paper key={item._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
            <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }}/>
            <Box sx={{ flexGrow: 1 }}>
              <Typography>{item.name}</Typography>
              <Typography color="primary">₹{item.price}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => decreaseQty(item)}><Remove /></IconButton>
              <Typography sx={{ mx: 1 }}>{item.qty}</Typography>
              <IconButton onClick={() => addToCart(item, 1)}><Add /></IconButton>
              <IconButton color="error" onClick={() => removeFromCart(item._id)}><Delete /></IconButton>
            </Box>
          </Paper>
        ))
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button component={Link} to="/" variant="outlined">
          ← BACK TO SHOP
        </Button>

        {cart.length > 0 && (
          <Button 
            variant="contained" 
            onClick={handleCheckout}
            disabled={loading} // disable while placing
            sx={{ background: '#1976d2' }}
          >
            {loading ? 'PLACING...' : 'PLACE ORDER'}
          </Button>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>Total: ₹{total}</Typography>
    </Container>
  );
}
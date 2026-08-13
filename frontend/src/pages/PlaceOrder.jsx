import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { useCart } from '../context/CartContext'

export default function PlaceOrder() {
  const { cartItems, cartTotal, clearCart } = useCart() // FIXED: was cart
  const navigate = useNavigate()

  useEffect(() => {
    if(!cartItems || cartItems.length === 0) navigate('/cart') // redirect if empty
  }, [cartItems, navigate])

  const itemsPrice = cartTotal
  const taxPrice = itemsPrice * 0.18
  const shippingPrice = itemsPrice > 1000? 0 : 50
  const totalPrice = itemsPrice + taxPrice + shippingPrice

  if(!cartItems || cartItems.length === 0) return <Container><Typography>Loading...</Typography></Container>

  const placeOrderHandler = () => {
    navigate('/checkout') // Go to COD form
  }

  return (
    <Container sx={{padding: '20px', mt:4}}>
      <Typography variant="h4" gutterBottom>Order Summary</Typography>
      <Paper sx={{p:2, mb:2}}>
      {cartItems.map(item => (
        <Box key={item._id} sx={{display:'flex', justifyContent:'space-between', py:1}}>
          <Typography>{item.name} x {item.qty}</Typography>
          <Typography>₹{(item.price * item.qty).toFixed(2)}</Typography>
        </Box>
      ))}
      </Paper>
      
      <Paper sx={{p:2}}>
        <Typography>Items: ₹{itemsPrice.toFixed(2)}</Typography>
        <Typography>Shipping: ₹{shippingPrice.toFixed(2)}</Typography>
        <Typography>Tax: ₹{taxPrice.toFixed(2)}</Typography>
        <Typography variant="h5" sx={{mt:1}}>Total: ₹{totalPrice.toFixed(2)}</Typography>
      </Paper>

      <Button variant="contained" fullWidth sx={{mt:3}} onClick={placeOrderHandler}>
        Proceed To Checkout
      </Button>
    </Container>
  )
}
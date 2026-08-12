import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box } from '@mui/material'
import { useCart } from '../context/CartContext'

export default function PlaceOrder() {
  const { cart } = useCart() // was cartItems
  const navigate = useNavigate()

  useEffect(() => {
    if(!cart || cart.length === 0) navigate('/cart') // redirect if empty
  }, [cart, navigate])

  const total = cart?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0

  if(!cart || cart.length === 0) return <Container><Typography>Loading...</Typography></Container>

  return (
    <Container sx={{padding: '20px', mt:4}}>
      <Typography variant="h4">Order Summary</Typography>
      {cart.map(item => (
        <Box key={item._id} sx={{display:'flex', justifyContent:'space-between'}}>
          <Typography>{item.name} x {item.qty}</Typography>
          <Typography>₹{item.price * item.qty}</Typography>
        </Box>
      ))}
      <Typography variant="h5" sx={{mt:2}}>Total: ₹{total}</Typography>
      <Button variant="contained" onClick={() => navigate(`/order/xxx`)}>CONFIRM ORDER</Button>
    </Container>
  )
}
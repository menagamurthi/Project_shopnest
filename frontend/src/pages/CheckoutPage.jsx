import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material'
import API from '../api';

const CheckoutPage = () => {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('India')

  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    if(cartItems.length === 0) {
      toast.error('Cart is empty')
      return
    }
    setLoading(true)
    const shippingAddress = { address, city, postalCode, country }

    const itemsPrice = cartTotal
    const taxPrice = itemsPrice * 0.18
    const shippingPrice = itemsPrice > 1000 ? 0 : 50
    const totalPrice = itemsPrice + taxPrice + shippingPrice

    const orderItems = cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image.replace(/\\/g, '/'),
      price: item.price,
      product: item._id
    }))

    try {
      const { data } = await API.post('/orders', { // ✅ USE API, NO token manually
        orderItems,
        shippingAddress,
        paymentMethod: "COD",
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      clearCart()
      toast.success('Order Placed Successfully!')
      navigate(`/order/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 3}}>Checkout</Typography>
      <Box component="form" onSubmit={submitHandler} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <TextField label="Full Address" value={address} onChange={(e)=>setAddress(e.target.value)} required />
        <Box sx={{display: 'flex', gap: 2}}>
          <TextField label="City" value={city} onChange={(e)=>setCity(e.target.value)} required fullWidth />
          <TextField label="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} required sx={{width: '50%'}} />
        </Box>
        <TextField label="Country" value={country} onChange={(e)=>setCountry(e.target.value)} required />
        
        <Paper sx={{p: 2, mt: 2}}>
          <Typography variant="h6">Payment Method</Typography>
          <Typography>Cash on Delivery</Typography>
          <Typography variant="h6" sx={{mt: 2}}>Total: ₹{cartTotal.toFixed(2)}</Typography>
        </Paper>
        
        <Button type="submit" variant="contained" size="large" disabled={loading} sx={{mt: 2}}>
          {loading ? 'Placing Order...' : 'Place Order COD'}
        </Button>
      </Box>
    </Container>
  )
}
export default CheckoutPage
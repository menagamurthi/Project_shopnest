import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Container, Grid, Typography, Button, Box, Chip, Divider, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
const API_URL = import.meta.env.VITE_API_URL;
const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`)
      setProduct(data)
    } catch (err) {
      console.log(err)
    }
  }
  fetchProduct()
}, [id])

  if(!product) return <Typography sx={{p:4}}>Loading...</Typography>

  const imageUrl = `${API_URL.replace('/api', '')}${product.image.replace(/\\/g, '/')}`
  const addToCartHandler = () => {
    addToCart({...product, qty})
    toast.success(`${product.name} added to cart`)
    navigate('/cart')
  }

  return (
    <Container sx={{py: 4}}>
      <Button component={Link} to='/' startIcon={<ArrowBackIcon />}>BACK TO SHOP</Button>
      
      <Grid container spacing={4} sx={{mt: 1}}>
        <Grid item md={6}>
          <Box component="img" src={imageUrl} alt={product.name} sx={{width: '100%', borderRadius: 2}} />
        </Grid>

        <Grid item md={3}>
          <Typography variant="h4">{product.name}</Typography>
          <Divider sx={{my: 2}} />
          <Typography variant="body1" sx={{mb: 2}}>{product.description}</Typography>
          <Typography variant="body2"><strong>Category:</strong> {product.category}</Typography>
        </Grid>

        <Grid item md={3}>
          <Box sx={{border: '1px solid #ddd', p: 2, borderRadius: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>₹{product.price}</Typography>
            <Typography sx={{mb: 2}}>
              <strong>Status:</strong> 
              <Chip label={product.countInStock > 0 ? `In Stock` : 'Out Of Stock'} 
                    color={product.countInStock > 0 ? 'success' : 'error'} size="small" sx={{ml:1}}/>
            </Typography>

            {product.countInStock > 0 && (
              <TextField
                select
                label="Qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                SelectProps={{ native: true }}
                fullWidth
                sx={{mb: 2}}
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </TextField>
            )}

            <Button 
              variant="contained" 
              fullWidth
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              {product.countInStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductDetails
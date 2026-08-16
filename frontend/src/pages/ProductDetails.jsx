import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Container, Grid, Typography, Button, Box, Chip, Divider, TextField, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error('Product not found');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${API_URL.replace('/api', '')}${product.image.replace(/\\/g, '/')}`;

  const addToCartHandler = () => {
    if (!userInfo) {
      toast.info('Please login to add items to cart');
      navigate(`/login?redirect=/product/${id}`);
      return;
    }

    addToCart({ ...product, qty });
    toast.success(`${product.name} added to cart`);
    navigate('/cart');
  };

  return (
    <Container sx={{ py: 5 }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3, fontWeight: 700 }}>
        Back to shop
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 4 }}>
            <Box
              component="img"
              src={imageUrl}
              alt={product.name}
              sx={{ width: '100%', height: 520, objectFit: 'cover', borderRadius: 3 }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/900x900?text=No+Image';
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{product.name}</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{product.description}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ mb: 1 }}><strong>Brand:</strong> {product.brand}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}><strong>Category:</strong> {product.category}</Typography>
          <Typography variant="body2"><strong>Availability:</strong> {product.countInStock > 0 ? `${product.countInStock} ready to ship` : 'Out of stock'}</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>₹{product.price}</Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out Of Stock'}
                color={product.countInStock > 0 ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>

            {product.countInStock > 0 && (
              <TextField
                select
                label="Qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                SelectProps={{ native: true }}
                fullWidth
                sx={{ mb: 2 }}
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
              sx={{ py: 1.5, fontSize: 16 }}
            >
              {product.countInStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
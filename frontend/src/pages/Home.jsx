import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, MenuItem, Typography, Box, CircularProgress, Paper } from '@mui/material';
import ProductCard from '../components/ProductCard';

const API_URL = import.meta.env.VITE_API_URL?.trim();

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories] = useState(['All', 'Electronics', 'Shoes', 'Clothing', 'Kids']);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/api/products`;
      const params = new URLSearchParams();

      if (keyword) params.append('keyword', keyword);
      if (category !== 'All') params.append('category', category);

      if (params.toString()) url += `?${params.toString()}`;

      const { data } = await axios.get(url);
      setProducts(data);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, category]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchProducts]);

  return (
    <Container sx={{ py: 4 }}>
      <Paper 
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #f97316 140%)',
          color: '#fff',
          borderRadius: 4,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Discover your next favorite pick
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 620 }}>
          Style, essentials, and everyday comfort — curated for modern living.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          label="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ background: '#fff', borderRadius: 2 }}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 220, background: '#fff', borderRadius: 2 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography sx={{ ml: 2, mt: 4 }}>No products found</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, MenuItem, Typography, Box } from '@mui/material'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']); // <-- NEW
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');

  // Fetch categories from DB on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories')
        setCategories(data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `/api/products?keyword=${keyword}&category=${category}`
        );
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [keyword, category]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Products</Typography>
      
      {/* SEARCH + FILTER */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField 
          fullWidth
          label="Search products..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <TextField 
          select
          label="Category"
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {categories.map(cat => ( // <-- LOOP FROM DB
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* PRODUCT GRID */}
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography sx={{ml: 2}}>No products found</Typography>
        ) : (
          products.map(product => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  )
}
export default Home;
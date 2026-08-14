import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import API from '../../api'; // namma api.js

const categories = ['Shoes', 'Electronics', 'Clothing', 'Accessories', 'Home'];

export default function CreateProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Image upload to cloudinary
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImage(data.image); // cloudinary url
      setUploading(false);
      toast.success('Image uploaded');
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Upload failed');
    }
  };

  // Create Product submit
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/products', {
        name, price, image, brand, category, description, countInStock
      });
      toast.success('Product Created');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Create failed');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" mb={3}>Create Product</Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} margin="normal" required />
          
          <TextField fullWidth label="Image URL" value={image} onChange={e => setImage(e.target.value)} margin="normal" required />
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload Image
            <input type="file" hidden onChange={uploadFileHandler} />
          </Button>
          {uploading && <CircularProgress size={20} />}
          {image && <img src={image} alt="" style={{ width: 100, display: 'block', mt: 1 }} />}

          <TextField fullWidth label="Brand" value={brand} onChange={e => setBrand(e.target.value)} margin="normal" required />
          <TextField select fullWidth label="Category" value={category} onChange={e => setCategory(e.target.value)} margin="normal" required>
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Count In Stock" type="number" value={countInStock} onChange={e => setCountInStock(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Description" multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} margin="normal" required />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading? 'Creating...' : 'Create'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
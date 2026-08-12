import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Button, Typography, Paper, IconButton, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product Deleted');
      setProducts(products.filter(p => p._id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          component={Link} 
          to='/admin/product/new'
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>NAME</b></TableCell>
              <TableCell><b>PRICE</b></TableCell>
              <TableCell><b>CATEGORY</b></TableCell>
              <TableCell align="center"><b>ACTIONS</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>{product._id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary" 
                    onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => deleteHandler(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProductsPage;
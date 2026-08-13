import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Button, Typography, Paper, IconButton, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [userInfo, isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Create a sample product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.post(`/api/products`, {}, config);
        toast.success('Product Created');
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed');
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('Product Deleted');
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed');
      }
    }
  };

  if (!userInfo || !isAdmin) return <p>Redirecting...</p>;
  if (loading) return <Box sx={{display:'flex', justifyContent:'center', mt:5}}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={createProductHandler}>
          Create Product
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
              <TableCell><b>BRAND</b></TableCell>
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
                <TableCell>{product.brand}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" component={Link} to={`/admin/product/${product._id}/edit`}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteHandler(product._id)}>
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

export default AdminProducts;
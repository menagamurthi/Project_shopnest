import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, CircularProgress, Alert, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };
    if(userInfo) fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, config);
      setOrders(orders.map(o => o._id === id ? {...o, status} : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    if(status === 'Delivered') return 'success';
    if(status === 'Shipped') return 'info';
    return 'warning';
  }

  if (loading) return <Container sx={{mt:4}}><CircularProgress /></Container>;
  if (error) return <Container sx={{mt:4}}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Orders - {orders.length}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor: '#f5f5f5'}}>
            <TableRow>
              <TableCell><b>ORDER ID</b></TableCell>
              <TableCell><b>CUSTOMER</b></TableCell>
              <TableCell><b>DATE</b></TableCell>
              <TableCell><b>TOTAL</b></TableCell>
              <TableCell><b>STATUS</b></TableCell>
              <TableCell><b>ACTIONS</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id.substring(0, 10)}...</TableCell>
                <TableCell>{order.user?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>₹{order.totalPrice}</TableCell>
<TableCell>
  <Chip 
    label={order.status || 'Processing'} 
    color={getStatusColor(order.status || 'Processing')} 
    size="small"
    sx={{mb:1}}
  />
  <Select 
    value={order.status || 'Processing'}
    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
    size="small"
    sx={{minWidth: 120, display: 'block'}}
  >
    <MenuItem value="Processing">Processing</MenuItem>
    <MenuItem value="Shipped">Shipped</MenuItem>
    <MenuItem value="Delivered">Delivered</MenuItem>
  </Select>
</TableCell>
                <TableCell>
                  <Button component={Link} to={`/order/${order._id}`} variant="outlined" size="small">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminOrders;

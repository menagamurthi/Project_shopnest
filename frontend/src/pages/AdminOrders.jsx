import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, CircularProgress, Alert, Chip, TextField, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';
import API from '../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) => {
      const customerName = order.user?.name || '';
      const orderId = String(order._id || '');
      return customerName.toLowerCase().includes(term) || orderId.toLowerCase().includes(term);
    });
  }, [orders, search]);

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order._id === id ? { ...order, orderStatus: status, status } : order))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return 'success';
    if (status === 'Shipped') return 'info';
    return 'warning';
  };

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Orders - {orders.length}</Typography>

      <TextField
        fullWidth
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        label="Search by customer or order id"
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
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
            {paginatedOrders.map((order) => {
              const currentStatus = order.orderStatus || order.status || 'Processing';
              return (
                <TableRow key={order._id}>
                  <TableCell>{order._id.substring(0, 10)}...</TableCell>
                  <TableCell>{order.user?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>₹{Number(order.totalPrice || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={currentStatus}
                      color={getStatusColor(currentStatus)}
                      size="small"
                      sx={{ mb: 1, display: 'block' }}
                    />
                    <Select
                      value={currentStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 120, display: 'block' }}
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
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Container>
  );
};

export default AdminOrders;

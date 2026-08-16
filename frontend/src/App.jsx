import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CartScreen from './pages/CartScreen';
import ProductDetails from './pages/ProductDetails';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import CheckoutPage from './pages/CheckoutPage';
import AdminOrders from './pages/AdminOrders';

import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import UserListScreen from './screens/admin/UserListScreen';
import AdminDashboard from './screens/admin/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const theme = createTheme();

function App() {
  return (
    <CartProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', overflow: 'auto' }}>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserListScreen />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<ProductListScreen />} />
              <Route path="product/:id/edit" element={<ProductEditScreen />} />
              <Route path="product/create" element={<ProductCreateScreen />} />
            </Route>
          </Routes>
        </Box>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App;
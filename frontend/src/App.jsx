import React from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext'; // 1. Import this

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import PlaceOrder from './pages/PlaceOrder'; 
import AdminOrders from './pages/AdminOrders' 
import AdminProducts from './pages/AdminProducts' 
import AdminDashboard from './pages/AdminDashboard'

const theme = createTheme();

function App() {
  const { userInfo } = useAuth(); // 2. Use context instead of localStorage

  const isAdmin = userInfo?.user?.isAdmin;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/myorders" element={<MyOrders />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/orders" 
          element={isAdmin ? <AdminOrders /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/products" 
          element={isAdmin ? <AdminProducts /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
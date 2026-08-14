import React from 'react'; 
import { Routes, Route } from 'react-router-dom'; // REMOVED Navigate
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import CartScreen from './pages/CartScreen';
import ProductDetails from './pages/ProductDetails';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import CheckoutPage from './pages/CheckoutPage'; 
import AdminOrders from './pages/AdminOrders' 
import AdminProducts from './pages/AdminProducts' 
import AdminDashboard from './pages/AdminDashboard'
import ProductEditScreen from './screens/admin/ProductEditScreen';


const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();
  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;
  
  // NO REDIRECT. JUST SHOW OR HIDE
  if (!userInfo) return <div style={{padding:20}}>Please Login First</div>;
  if (!isAdmin) return <div style={{padding:20}}>Not Admin</div>;
  
  return children;
};

const theme = createTheme();

function App() {
  return (
    <CartProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />		  
		  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
        </Routes>
      </ThemeProvider>
    </CartProvider>
  );
}
export default App;
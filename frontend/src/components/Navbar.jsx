import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- ADD THIS

export default function Navbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth(); // <-- USE CONTEXT INSTEAD OF localStorage

  const logoutHandler = () => {
    logout(); // <-- this will clear both context + localStorage
    navigate('/login');
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Shopnest
        </Typography>

        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/cart')}>Cart</Button>
          
          {userInfo ? (
            <>
              <Button color="inherit" onClick={() => navigate('/myorders')}>My Orders</Button>
              
              {/* ADMIN BUTTONS */}
              {userInfo?.user?.isAdmin && (
                <>
                  <Button color="inherit" component={Link} to="/admin">Dashboard</Button>
                  <Button color="inherit" component={Link} to="/admin/orders">All Orders</Button>
                  <Button color="inherit" component={Link} to="/admin/products">Products</Button>
                </>
              )}

              <Button color="inherit" onClick={logoutHandler}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
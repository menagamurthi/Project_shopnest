import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
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
              
              {/* ADMIN BUTTONS - FIXED: only check userInfo.user.isAdmin once */}
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
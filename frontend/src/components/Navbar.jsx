import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const handleAdminClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAdmin = userInfo?.user?.isAdmin || userInfo?.isAdmin;

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #111827 0%, #1f2937 100%)', boxShadow: '0 8px 24px rgba(17,24,39,.15)' }}>
      <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 800, letterSpacing: 0.5 }} onClick={() => navigate('/')}>
          Shopnest
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/cart')}>Cart</Button>

          {userInfo ? (
            <>
              <Button color="inherit" onClick={() => navigate('/myorders')}>My Orders</Button>

              {isAdmin && (
                <>
                  <Button color="inherit" onClick={handleAdminClick}>Admin</Button>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={() => { navigate('/admin/dashboard'); handleClose(); }}>Dashboard</MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/users'); handleClose(); }}>Users</MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/products'); handleClose(); }}>Products</MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/orders'); handleClose(); }}>Orders</MenuItem>
                  </Menu>
                </>
              )}

              <Chip label={userInfo?.user?.name || userInfo?.name || 'User'} sx={{ color: '#fff', background: 'rgba(255,255,255,0.12)', fontWeight: 600, borderRadius: 999 }} />
              <Button color="inherit" onClick={logoutHandler}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
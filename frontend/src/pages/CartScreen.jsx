import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Container, Grid, Typography, Button, Card, CardMedia, Select, MenuItem, IconButton, Divider, Box, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartScreen = () => {
  const { cartItems = [], removeFromCart, updateQty, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => navigate('/checkout');

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>Shopping Cart</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography>Your cart is empty.</Typography>
              <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                Go Back
              </Button>
            </Paper>
          ) : (
            <Card sx={{ borderRadius: 4 }}>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ p: 2 }}>
                  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item xs={12} sm={2}>
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: '#111827', fontWeight: 600 }}>
                        {item.name}
                      </Link>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography>₹{item.price}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Select value={item.qty} onChange={(e) => updateQty(item._id, Number(e.target.value))} size="small" fullWidth>
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>{x + 1}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <IconButton onClick={() => removeFromCart(item._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Subtotal ({cartCount}) items</Typography>
            <Typography variant="h5" sx={{ my: 2, fontWeight: 800 }}>₹{cartTotal.toFixed(2)}</Typography>
            <Button variant="contained" fullWidth disabled={cartItems.length === 0} onClick={checkoutHandler} sx={{ py: 1.5 }}>
              Proceed To Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartScreen;
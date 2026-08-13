import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Container, Grid, Typography, Button, Card, CardMedia, Select, MenuItem, IconButton, Divider, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartScreen = () => {
  const { cartItems = [], removeFromCart, updateQty, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/checkout'); 
  };

  return (
    <Container sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 3}}>Shopping Cart</Typography>
      <Grid container spacing={3}>
        <Grid item md={8}>
          {cartItems.length === 0? (
            <Typography>Your cart is empty <Link to='/'>Go Back</Link></Typography>
          ) : (
            <Card>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{p: 2}}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item md={2}>
                      <CardMedia component="img" image={`http://localhost:5000${item.image.replace(/\\/g, '/')}`} alt={item.name} />
                    </Grid>
                    <Grid item md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Grid>
                    <Grid item md={2}>₹{item.price}</Grid>
                    <Grid item md={2}>
                      <Select value={item.qty} onChange={(e) => updateQty(item._id, Number(e.target.value))} size="small" fullWidth>
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>{x + 1}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item md={2}>
                      <IconButton onClick={() => removeFromCart(item._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{mt: 2}} />
                </Box>
              ))}
            </Card>
          )}
        </Grid>

        <Grid item md={4}>
          <Card sx={{p: 2}}>
            <Typography variant="h6">Subtotal ({cartCount}) items</Typography>
            <Typography variant="h5" sx={{my: 2}}>₹{cartTotal.toFixed(2)}</Typography>
            <Button 
              variant='contained' 
              fullWidth
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default CartScreen;
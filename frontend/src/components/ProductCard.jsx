import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 35px rgba(17, 24, 39, 0.12)',
        },
      }}
    >
      <Box sx={{ position: 'relative', bgcolor: '#f3f4f6' }}>
        <CardMedia
          component="img"
          height="220"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {product.category}
        </Typography>
        <Typography gutterBottom variant="h6" sx={{ mt: 1, minHeight: 48 }}>
          {product.name}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, color: '#111827', fontWeight: 800 }}>
          ₹{product.price}
        </Typography>
      </CardContent>

      <CardActions sx={{ display: 'flex', gap: 1, p: 2, pt: 0 }}>
        <Button size="small" component={Link} to={`/product/${product._id}`} variant="outlined" fullWidth>
          View Details
        </Button>
        <Button
          size="small"
          onClick={() => {
            addToCart({ ...product, qty: 1 });
            toast.success('Added to cart');
          }}
          variant="contained"
          fullWidth
        >
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart() // this was missing

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:5000${product.image.replace(/\\/g, '/')}`}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">{product.category}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>₹{product.price}</Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', gap: 1, p: 2 }}>
        <Button size="small" component={Link} to={`/product/${product._id}`} variant="outlined" fullWidth>
          View Details
        </Button>
        <Button 
          size="small" 
          onClick={() => { addToCart({...product, qty: 1}); toast.success('Added to cart') }} 
          variant="contained" 
          fullWidth
        >
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  )
}
export default ProductCard
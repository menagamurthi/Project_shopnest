import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
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
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.category}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          ₹{product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/product/${product._id}`} variant="contained" fullWidth>
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard
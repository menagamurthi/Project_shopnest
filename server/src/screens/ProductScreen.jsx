import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ProductScreen = ({ addToCart }) => {
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(data)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <h2>Loading...</h2>

  return (
    <>
      <Link to='/'>Go Back</Link>
      <div style={{display: 'flex', gap: '2rem', marginTop: '1rem'}}>
<img 
  src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}${product.image}`} 
  alt={product.name}
  style={{width: '400px', height: '400px', objectFit: 'cover'}}
  onError={(e) => e.target.src = 'https://placehold.co/400x400?text=No+Image'}
/>
        <div>
          <h2>{product.name}</h2>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>In Stock:</strong> {product.countInStock}</p>
          
          <button 
            onClick={() => addToCart({...product, qty: 1})}
            disabled={product.countInStock === 0}
            style={{padding: '10px 20px', background: 'black', color: 'white', border: 'none'}}
          >
            {product.countInStock > 0? 'Add To Cart' : 'Out Of Stock'}
          </button>
        </div>
      </div>
    </>
  )
}
export default ProductScreen
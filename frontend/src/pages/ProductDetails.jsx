import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'; 
import axios from 'axios'

const ProductDetails = () => {
  const { id } = useParams()
    const { addToCart } = useCart(); 
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(err => console.log(err))
  }, [id])

  if(!product) return <h2>Loading...</h2>

  // FIX: Add backend URL + fix windows backslash \ to /
  const imageUrl = `http://localhost:5000${product.image.replace(/\\/g, '/')}`

  return (
    <div style={{padding: '20px'}}>
      <Link to='/' style={{textDecoration: 'none'}}>BACK TO SHOP</Link>
      
      <div style={{display: 'flex', gap: '30px', marginTop: '20px'}}>
        
        <div style={{flex: 1}}>
          <img src={imageUrl} alt={product.name} style={{width: '100%', borderRadius: '8px'}} />
        </div>

        <div style={{flex: 1}}>
          <h2>{product.name}</h2>
          <h3 style={{color: 'blue'}}>₹{product.price}</h3>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Status:</strong> {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out Of Stock'}</p>
          
          <button 
            disabled={product.countInStock === 0}
            style={{padding: '10px 20px', width: '100%', cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer'}}
			 onClick={() => addToCart(product, 1)}
          >
            {product.countInStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ProductDetails
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Product {
  _id: string
  name: string
  image: string
  brand: string
  category: string
  description: string
  price: number
  countInStock: number
}

const ProductScreen = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`)
      setProduct(data)
    }
    fetchProduct()
  }, [id])

  if (!product) return <p className='text-center mt-10'>Loading...</p>

  return (
    <div>
      <Link to="/" className='text-blue-500 mb-4 inline-block'>&larr; Go Back</Link>
      <div className='grid md:grid-cols-2 gap-8'>
        <img src={product.image} alt={product.name} className='w-full rounded-lg shadow' />
        <div>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-gray-500 text-lg'>{product.brand} | {product.category}</p>
          <p className='text-4xl font-bold text-green-600 my-4'>₹{product.price}</p>
          <p className='mb-4 text-gray-700'>{product.description}</p>
          <p className='mb-4 font-semibold'>Status: {product.countInStock > 0? 'In Stock' : 'Out of Stock'}</p>
          <button 
            disabled={product.countInStock === 0}
            className='bg-yellow-400 w-full py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 disabled:bg-gray-300'
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
export default ProductScreen
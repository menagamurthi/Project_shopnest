import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('http://${import.meta.env.VITE_API_URL}/api/products')
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <>
      <h1 className='text-3xl font-bold mb-6'>ShopNest - Latest Products</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className='border rounded-lg p-4 hover:shadow-lg transition'>
              <img src={product.image} alt={product.name} className='h-48 w-full object-cover mb-4 rounded' />
              <p className='text-sm text-gray-500'>{product.category}</p>
              <h2 className='text-lg font-semibold'>{product.name}</h2>
              <p className='text-green-600 font-bold text-xl'>₹{product.price}</p>
              <p className='text-sm'>Stock: {product.countInStock}</p>
              <button className='bg-yellow-400 w-full py-2 rounded mt-2 hover:bg-yellow-500'>
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
export default Home
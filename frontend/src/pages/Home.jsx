import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Fetch products whenever search or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products?search=${search}&category=${category}`);
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [search, category]);

  return (
    <div className="container mx-auto p-4">
      
      {/* SEARCH + FILTER UI - Put this ABOVE your product grid */}
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothes">Clothes</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* YOUR PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="border p-4 rounded">
              <img src={product.image} alt={product.name} className="h-40 w-full object-cover mb-2" />
              <h2 className="font-bold">{product.name}</h2>
              <p>₹{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
export default Home;
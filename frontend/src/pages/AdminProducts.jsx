import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
    fetchProducts();
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a sample product?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.post(`/api/products`, {}, config);
        fetchProducts(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to create product');
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button onClick={createProductHandler} style={{ padding: '10px 15px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          + Create Product
        </button>
      </div>

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>NAME</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>PRICE</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>CATEGORY</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>BRAND</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product._id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{product.price}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.brand}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <Link to={`/admin/product/${product._id}/edit`}>
                  <button style={{ marginRight: '10px', cursor: 'pointer' }}>Edit</button>
                </Link>
                <button style={{ cursor: 'pointer', background: 'red', color: 'white', border: 'none' }} onClick={() => deleteHandler(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5001/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDeliveredHandler = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.put(`http://localhost:5001/api/orders/deliver/${id}`, {}, config); 
      
      // NEW: Don't fetch. Just update the state directly
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === id 
            ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } 
            : order
        )
      );
      
      alert('Order marked as delivered!');
    } catch (err) {
      alert('Failed to mark delivered');
      console.log(err)
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Orders</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th><th>USER</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>DELIVERED</th><th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id.substring(0,8)}</td>
              <td>{order.user?.name}</td>
              <td>{order.createdAt.substring(0,10)}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.isPaid ? 'PAID' : 'NOT PAID'}</td>
              <td style={{color: order.isDelivered ? 'green' : 'red', fontWeight: 'bold'}}>
                {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
              </td>
              <td>
                {!order.isDelivered && (
                  <button onClick={() => markDeliveredHandler(order._id)}>MARK DELIVERED</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminOrdersPage;
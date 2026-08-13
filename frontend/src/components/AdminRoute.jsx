import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // change path if different

const AdminRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    return <h2>Loading...</h2> // <-- ADD THIS to stop blinking
  }

  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};

export default AdminRoute;
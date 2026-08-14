import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // change path if different

const AdminRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);
const isAdmin = userInfo?.isAdmin || userInfo?.user?.isAdmin
  if (loading) {
    return <h2>Loading...</h2> // <-- ADD THIS to stop blinking
  }

return userInfo && isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};


export default AdminRoute;
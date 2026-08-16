import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // named import with {}

const AdminRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const isAdmin = userInfo?.isAdmin || userInfo?.user?.isAdmin

  if (loading) return <h2 style={{textAlign:'center', marginTop: '50px'}}>Loading...</h2>

  return userInfo && isAdmin ? <Outlet /> : <Navigate to='/login' replace />;
};

export default AdminRoute;
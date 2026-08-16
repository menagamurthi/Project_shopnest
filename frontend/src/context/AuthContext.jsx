import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api'; // namma api.js file

export const AuthContext = createContext(); // <-- HERE: add 'export'
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const item = localStorage.getItem('userInfo');
      if (item) setUserInfo(JSON.parse(item));
    } catch (e) {
      console.log(e)
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/users/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const register = async (name, email, password) => { 
    const { data } = await API.post('/users/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
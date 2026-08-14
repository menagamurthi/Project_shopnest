import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api'; // or '../api/axio' whichever you use


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const item = localStorage.getItem('userInfo');
      if (item) setUserInfo(JSON.parse(item));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/users/login', { email, password }); // ✅
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    return data;
  };
const register = async (name, email, password) => { // <-- ADD THIS TOO
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
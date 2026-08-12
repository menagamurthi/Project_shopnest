import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  });

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password }); // <-- MUST be /api/users/login
    localStorage.setItem('userInfo', JSON.stringify(data)); // <-- Save the whole {token, user}
    setUserInfo(data); // <-- Update context
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
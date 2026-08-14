import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) req.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      localStorage.removeItem('userInfo');
    }
  }
  return req;
});

export const register = (name, email, password) => API.post('/users/register', { name, email, password });
export const login = (email, password) => API.post('/users/login', { email, password });
export const getProducts = () => API.get('/products');

export default API;
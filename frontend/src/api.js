import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

export const register = (name, email, password) => API.post('/users/register', { name, email, password });
export const login = (email, password) => API.post('/users/login', { email, password });
export const getProducts = () => API.get('/products');

export default API;

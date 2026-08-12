import axios from 'axios';


const API = axios.create({ baseURL: 'http://localhost:5001/api' });
// Add token to every request automatically
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Named exports for auth
export const register = (name, email, password) => API.post('/auth/register', { name, email, password });
export const login = (email, password) => API.post('/auth/login', { email, password });
export const getProducts = () => API.get('/products');
export default API;


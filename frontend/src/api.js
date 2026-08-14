import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shopnest-backend-urkd.onrender.com', // Hardcoded
});

// Request ku munnadi token attach pannum
api.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Auth functions
export const register = (name, email, password) => 
  api.post(`/api/users/register`, { name, email, password });

export const login = (email, password) => 
  api.post(`/api/users/login`, { email, password });

// Products
export const getProducts = (keyword = '', category = '') => {
  let url = `/api/products`;
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (category && category !== 'All') params.append('category', category);
  if (params.toString()) url += `?${params.toString()}`;
  return api.get(url);
};

export const getProductById = (id) => api.get(`/api/products/${id}`); // <-- idhuvum add pannu

export default api;
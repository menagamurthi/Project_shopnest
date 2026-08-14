import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.trim(); // trim panni space remove

const api = axios.create({
  baseURL: API_URL,
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

export default api;
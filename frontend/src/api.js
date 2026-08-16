import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
})

// Token auto attach
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return config;
});

// Auth
export const register = (name, email, password) => 
  api.post(`/users/register`, { name, email, password });

export const login = (email, password) => 
  api.post(`/users/login`, { email, password });

// Products
export const getProducts = (keyword = '', category = '') => {
  let url = `/products`;
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (category && category !== 'All') params.append('category', category);
  if (params.toString()) url += `?${params.toString()}`;
  return api.get(url);
};

export const getProductById = (id) => api.get(`/products/${id}`);

// Admin
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const createProduct = () => api.post(`/products`, {}); // <-- empty body anupuvom
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);

// Orders
export const getOrders = () => api.get(`/orders`);
export const getMyOrders = () => api.get(`/orders/myorders`);

export default api;
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const getProducts = () => API.get('/products');
export const createProduct = (product) => API.post('/products', product);
export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Carts API
export const getCarts = () => API.get('/carts');
export const createCart = (cart) => API.post('/carts', cart);
export const updateCart = (id, cart) => API.put(`/carts/${id}`, cart);
export const deleteCart = (id) => API.delete(`/carts/${id}`);

// Add to Cart function 
export const addToCart = (cartItem) => {
  
  return API.post('/carts', {
    userId: cartItem.userId || 1, // Default user ID or fetch from context/auth
    products: [{ productId: cartItem.productId, quantity: cartItem.quantity || 1 }],
  });
};

// Users API
export const getUsers = () => API.get('/users');
export const createUser = (user) => API.post('/users', user);
export const updateUser = (id, user) => API.put(`/users/${id}`, user);
export const deleteUser = (id) => API.delete(`/users/${id}`);
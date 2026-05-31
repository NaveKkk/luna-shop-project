import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:3000' : 'https://luna-shop-backend-xr1d.onrender.com');

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;

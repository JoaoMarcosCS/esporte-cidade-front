import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002/api/',
});

// Add this interceptor to include the token in every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
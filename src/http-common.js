// axios.js
import axios from 'axios';

const VITE_APP_HOST_HTTP = import.meta.env.VITE_APP_HOST_HTTP;

const http = axios.create({
  baseURL: VITE_APP_HOST_HTTP,
  headers: {
    'Content-type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && token !== 'false') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default http;

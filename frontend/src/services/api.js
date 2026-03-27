import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo.token) {
        config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

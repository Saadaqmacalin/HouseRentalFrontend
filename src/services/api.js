import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://houserental-backend-9k4k.onrender.com/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    // Check for admin/customer user or landlordToken
    const user = JSON.parse(localStorage.getItem('user'));
    const landlordToken = localStorage.getItem('landlordToken');
    
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    } else if (landlordToken) {
      config.headers.Authorization = `Bearer ${landlordToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

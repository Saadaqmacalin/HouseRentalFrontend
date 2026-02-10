import axios from 'axios';

const api = axios.create({
  // Use /api for local development (Vite proxy) and the full URL for production
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    // Try to get token from 'user' object (Admin/Customer) or 'landlordToken'
    const user = JSON.parse(localStorage.getItem('user'));
    const landlordToken = localStorage.getItem('landlordToken');
    
    // Logic: If we have a landlord token and this is a landlord request, use it.
    // Otherwise, fallback to the user/admin token if available.
    if (landlordToken) {
      config.headers.Authorization = `Bearer ${landlordToken}`;
    } else if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

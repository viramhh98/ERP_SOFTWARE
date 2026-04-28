import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// B. Request Interceptor (Updated with Company & Branch Headers)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token');
    
    // Grab company and branch IDs from localStorage
    const activeCompanyId = localStorage.getItem('activeCompanyId');
    const activeBranchId = localStorage.getItem('activeBranchId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 Injected Custom Headers for Backend Middlewares
    if (activeCompanyId) {
      config.headers['activecompanyid'] = activeCompanyId;
    }

    if (activeBranchId) {
      config.headers['activebranchid'] = activeBranchId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all sensitive data on logout
      localStorage.removeItem('erp_token');
      localStorage.removeItem('activeCompanyId');
      localStorage.removeItem('activeBranchId');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;

// FILE PATH: src/services/api.js
// API Service - Axios instance with interceptors and error handling

import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('sarsar-token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.url, response.status);
    }
    
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      // Unauthorized - Clear token and redirect to login
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Try to refresh token
        try {
          const refreshToken = localStorage.getItem('sarsar-refresh-token');
          
          if (refreshToken) {
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
              { refreshToken }
            );
            
            const { token } = response.data;
            localStorage.setItem('sarsar-token', token);
            
            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - logout user
          localStorage.removeItem('sarsar-token');
          localStorage.removeItem('sarsar-refresh-token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('❌ API Error:', status, data);
      }
      
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        errors: data.errors || null,
      });
    }
    
    // Network error
    if (error.request) {
      console.error('❌ Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    }
    
    // Other errors
    console.error('❌ Error:', error.message);
    return Promise.reject({
      status: 0,
      message: error.message || 'An unexpected error occurred',
    });
  }
);

// Helper functions
export const apiHelpers = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // Upload file
  upload: (url, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
};

export default api;
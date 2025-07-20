import axios, { AxiosInstance } from 'axios';
import { API_KEYS, BASE_API, PROXY } from '@/config/proxy';
import { errorHandling } from './errorHandling';
import { useAuthStore } from '@/stores/authStore';

// Function to apply interceptors with all headers
const applyInterceptors = (instance: AxiosInstance) => {
  const token = useAuthStore.getState().accessToken;
  instance.interceptors.request.use(
    (config) => {
      // Set all headers dynamically
      config.headers['Content-Type'] = 'application/json';
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      errorHandling(error);
      return Promise.reject(error);
    }
  );
};

// Base API instance
export const api = axios.create({
  baseURL: BASE_API + PROXY[API_KEYS.BASE_API]
});

// Apply interceptors to both instances
applyInterceptors(api);

import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/authStore';
import { API_KEYS, BASE_API, PROXY } from '@/config/proxy';
import { ApiErrorResponse, errorHandling } from './errorHandling';

// Check if the JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const tokenData = jwtDecode<{ exp?: number }>(token);
    const expiry = tokenData.exp;
    return expiry ? Math.floor(Date.now() / 1000) >= expiry : true;
  } catch {
    return true; // Assume expired if decoding fails
  }
};

// Request controller for cancellation
export const requestController = {
  controller: new AbortController()
};

// Main request function
const request = async (
  url: string,
  options: any = {},
  apiKey = API_KEYS.BASE_API
) => {
  const clearTokens = useAuthStore.getState().clearStorage;
  const {
    method = 'POST',
    data = {},
    params = {},
    responseType = '',
    noAuth = false,
    isHideNotification = false,
    timeout = undefined
  } = options;

  const { cancelToken = null } = data;

  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: !noAuth
      ? `Bearer ${useAuthStore.getState().accessToken}`
      : ''
  };

  const paramsTemp = { ...params };
  delete paramsTemp.cancelToken;

  const baseAPI =
    BASE_API || (typeof window !== 'undefined' ? window.location.origin : '');

  const instance = axios.create({
    baseURL: baseAPI + PROXY[apiKey],
    headers,
    params: paramsTemp,
    cancelToken,
    signal: requestController.controller.signal,
    timeout
  });

  // Request interceptor to check token expiration
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;
      if (token && isTokenExpired(token)) {
        const error = {
          response: {
            status: 401
          }
        };
        clearTokens();
        return Promise.reject(error);
      }
      if (responseType) {
        config.responseType = responseType;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor (currently just passes through)
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  try {
    delete data.cancelToken; // Remove cancelToken from data to avoid sending it
    const res = await instance.request({ url, method, data });
    return res.data;
  } catch (e) {
    if (axios.isCancel(e)) {
      throw e; // Propagate cancellation errors
    }
    // Pass error to errorHandling, which will throw the original AxiosError
    return errorHandling(e as AxiosError<ApiErrorResponse>, isHideNotification);
  }
};

export default request;

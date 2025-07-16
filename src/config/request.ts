import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/authStore';
import { showNotification } from '@/components/common/notification';
import { API_KEYS, BASE_API, PROXY } from '@/config/proxy';
import { useSignOut } from '@/hooks/use-auth';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Delete data successfully.',
  400: 'The request was sent with an error. The server did not perform any operations to create or modify data.',
  401: 'The user does not have permission (token, username, password is incorrect).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The request made is for a record that does not exist and the server is not operating.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be obtained again.',
  422: 'When creating an object, a validation error occurred.',
  500: 'The server has an error, please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable, the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.'
};

const isTokenExpired = (token: string) => {
  let expiry: number | undefined;
  if (token) {
    const tokenData = jwtDecode(token);
    expiry = tokenData.exp;
  }
  return expiry && Math.floor(new Date().getTime() / 1000) >= expiry;
};

const errorHandler = (error: any) => {
  const { response } = error;
  const status = response?.code;

  if (status === 403) {
    useSignOut().mutate();
    showNotification('error', 'Your session has expired. Please log in again.');
    return { code: status };
  }

  if (status === 401) {
    useSignOut().mutate();
    showNotification('error', 'Unauthorized: Please log in again.');
    return { code: status };
  }

  if (!response) {
    useSignOut().mutate();
    showNotification(
      'error',
      'Network error: Unable to connect to the server.'
    );
  } else {
    useSignOut().mutate();
    const message =
      codeMessage[status as keyof typeof codeMessage] || 'An error occurred.';
    showNotification('error', message);
  }

  return response?.data;
};

export const requestController = {
  controller: new AbortController()
};

const request = async (
  url: string,
  options: any = {},
  apiKey = API_KEYS.BASE_API
) => {
  const {
    method = 'POST',
    data = {},
    params = {},
    responseType = '',
    noAuth = false,
    isShowError = true,
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

  instance.interceptors.request.use(
    (config: any) => {
      const token = useAuthStore.getState().accessToken;
      if (token && isTokenExpired(token)) {
        useSignOut().mutate();
        return Promise.reject(new Error('Token expired'));
      }
      if (responseType) {
        config.responseType = responseType;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  try {
    delete data.cancelToken;
    const res = await instance.request({
      url,
      method,
      data
    });
    return res.data;
  } catch (e) {
    if (isShowError) {
      const isCancel = axios.isCancel(e);
      return isCancel ? null : errorHandler(e);
    }
    return null;
  }
};

export default request;

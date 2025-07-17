import { showNotification } from '@/components/common';
import { AxiosError } from 'axios';

// Error messages for different status codes
const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Delete data successfully.',
  400: 'The request was sent with an error.',
  401: 'The user does not have permission (token, username, password incorrect).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The requested record does not exist.',
  406: 'The request format is not available.',
  410: 'The requested resource is permanently deleted.',
  422: 'A validation error occurred.',
  500: 'Server error, please check the server.',
  502: 'Gateway error.',
  503: 'Service unavailable, server temporarily overloaded or maintained.',
  504: 'Gateway timed out.'
} as const;

// Interface for API error response
export interface ApiErrorResponse {
  msg?: string;
  errors?: string[];
}

// Handle errors by showing notifications and throwing the original error
export const errorHandling = (
  error: AxiosError<ApiErrorResponse>,
  isHideNotification = false
): never => {
  let message: string;

  if (error.response) {
    const status = error.response.status;
    message =
      error.response.data?.msg ||
      codeMessage[status as keyof typeof codeMessage] ||
      'An error occurred.';
  } else if (error.request) {
    message = 'Network error: Unable to connect to the server.';
  } else {
    message = error.message || 'An unexpected error occurred.';
  }

  if (!isHideNotification) {
    showNotification('error', message);
  }

  throw error;
};

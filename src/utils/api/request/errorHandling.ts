import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const errorHandling = (error: AxiosError) => {
  const { response } = error;

  if (response) {
    const { status, data } = response;

    // Handle different status codes
    switch (status) {
      case 401:
        toast.error('Unauthorized. Please login again.');
        // Redirect to login page or refresh token
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error((data as { message?: string })?.message || 'Something went wrong');
    }
  } else {
    toast.error('Network error. Please check your connection.');
  }

  return Promise.reject(error);
};

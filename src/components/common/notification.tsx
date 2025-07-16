import { toast } from 'sonner';

export const showNotification = (
  type: 'success' | 'error' | 'info' | 'warning' | 'loading',
  title: string,
  description?: string
) => {
  toast[type](title, { description });
};

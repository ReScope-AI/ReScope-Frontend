import { toast } from 'sonner';

const toastStyles: Record<
  'success' | 'error' | 'info' | 'warning' | 'loading',
  React.CSSProperties
> = {
  success: {
    background: '#e6fffa',
    color: '#2c7a7b',
    borderLeft: '6px solid #38b2ac'
  },
  error: {
    background: '#fff5f5',
    color: '#c53030',
    borderLeft: '6px solid #e53e3e'
  },
  info: {
    background: '#ebf8ff',
    color: '#2b6cb0',
    borderLeft: '6px solid #3182ce'
  },
  warning: {
    background: '#fffff0',
    color: '#b7791f',
    borderLeft: '6px solid #ecc94b'
  },
  loading: {
    background: '#f7fafc',
    color: '#4a5568',
    borderLeft: '6px solid #a0aec0'
  }
};

export const showNotification = (
  type: 'success' | 'error' | 'info' | 'warning' | 'loading',
  title: string,
  description?: string
) => {
  toast[type](title, {
    description,
    style: toastStyles[type]
  });
};

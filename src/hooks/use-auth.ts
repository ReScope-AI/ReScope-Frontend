import { showNotification } from '@/components/common';
import { loginWithGoogle } from '@/config/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Sign In
export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      googleId,
      email,
      name,
      avatar
    }: {
      googleId: string;
      email: string;
      name: string;
      avatar: string;
    }) => loginWithGoogle(googleId, email, name, avatar),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data.token;
      setTokens(accessToken.token, refreshToken.token);
      router.push('/dashboard');
    },
    onError: (error) => {
      showNotification('error', error?.message || 'Something went wrong');
    }
  });
};

// Sign Out
export const useSignOut = () => {
  const router = useRouter();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  return useMutation({
    mutationFn: async () => {
      clearTokens();
    },
    onSuccess: () => {
      router.push('/auth/sign-in');
    },
    onError: (error) => {
      showNotification('error', error?.message || 'Something went wrong');
      router.push('/auth/sign-in');
    }
  });
};

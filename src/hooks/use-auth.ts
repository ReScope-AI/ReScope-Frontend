import { loginWithGoogle } from '@/services/auth';
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
      name
    }: {
      googleId: string;
      email: string;
      name: string;
    }) => loginWithGoogle(googleId, email, name),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data.token;
      setTokens(accessToken.token, refreshToken.token);
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error);
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
      console.log('Sign out failed:', error);
      router.push('/auth/sign-in');
    }
  });
};

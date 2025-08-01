import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { showNotification } from '@/components/common';
import { loginWithGoogle } from '@/config/api/auth';
import { useTaskStore } from '@/features/kanban/utils/store';
import { useRetrospectiveStore } from '@/features/retrospectives/stores';
import { useAuthStore } from '@/stores/authStore';
import { usePollStore } from '@/stores/pollStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useUserStore } from '@/stores/userStore';

// Sign In
export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

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
      window.location.href = '/dashboard';
    },
    // Not showing error message because it's handled in the request/errorHandling.ts
    onError: () => {}
  });
};

// Sign Out
export const useSignOut = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      useAuthStore.getState().clearStorage();
      useUserStore.getState().clearStorage();
      useTaskStore.getState().clearStorage();
      usePollStore.getState().clearStorage();
      useRetroSessionStore.getState().clearStorage();
      useRetrospectiveStore.getState().clearStorage();
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

'use client';

import { getProfileAPI } from '@/config/api/auth';
import { QUERY_CONSTANTS } from '@/constants/query';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [isHydrated, setIsHydrated] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_CONSTANTS.AUTH.GET_PROFILE],
    queryFn: () => getProfileAPI(),
    enabled: !!accessToken && !!refreshToken,
    gcTime: Infinity,
    staleTime: 0
  });

  // Wait for Zustand to hydrate from local storage
  useEffect(() => {
    // Zustand's persist middleware will hydrate the state after mount
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (data) {
      useUserStore.getState().setUser(data.data);
    }
  }, [data]);

  // Only check tokens after hydration
  if (isHydrated && (!accessToken || !refreshToken)) {
    redirect('/auth/sign-in');
  }

  // Redirect if hydrated and not loading and no data
  if (isHydrated && !isLoading && !data) {
    redirect('/auth/sign-in');
  }

  // Render nothing until hydrated to avoid flicker
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;

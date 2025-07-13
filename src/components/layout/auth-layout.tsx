'use client';

import { useAuthStore } from '@/stores/authStore';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand to hydrate from local storage
  useEffect(() => {
    // Zustand's persist middleware will hydrate the state after mount
    setIsHydrated(true);
  }, []);

  // Only check tokens after hydration
  if (isHydrated && !accessToken && !refreshToken) {
    redirect('/auth/sign-in');
  }

  // Render nothing until hydrated to avoid flicker
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;

'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const router = useRouter();

  useEffect(() => {
    if (accessToken && refreshToken) {
      router.push('/dashboard');
    } else {
      router.push('/auth/sign-in');
    }
  }, [accessToken, refreshToken, router]);

  return null;
}

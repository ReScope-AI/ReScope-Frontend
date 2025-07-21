import { IAuthState } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);

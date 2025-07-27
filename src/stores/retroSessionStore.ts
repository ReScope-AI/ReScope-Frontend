import { IRetroSession } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RetroSessionState {
  retroSession: IRetroSession | null;
  setRetroSession: (retroSession: IRetroSession) => void;
  clearStorage: () => void;
}

export const useRetroSessionStore = create<RetroSessionState>()(
  persist(
    (set) => ({
      retroSession: null,
      setRetroSession: (retroSession) => set({ retroSession }),
      clearStorage: () => set({ retroSession: null })
    }),
    {
      name: 'retro-session-storage'
    }
  )
);

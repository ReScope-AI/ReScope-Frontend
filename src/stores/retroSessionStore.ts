import { IRetroSession } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RetroSessionState {
  retroSession: IRetroSession | null;
  setRetroSession: (retroSession: IRetroSession) => void;
  clearRetroSession: () => void;
}

export const useRetroSessionStore = create<RetroSessionState>()(
  persist(
    (set) => ({
      retroSession: null,
      setRetroSession: (retroSession) => set({ retroSession }),
      clearRetroSession: () => set({ retroSession: null })
    }),
    {
      name: 'retro-session-storage'
    }
  )
);

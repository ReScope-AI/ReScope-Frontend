import { RetroSession } from '@/features/retrospectives/stores';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RetroSessionState {
  retroSession: RetroSession | null;
  setRetroSession: (retroSession: RetroSession) => void;
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

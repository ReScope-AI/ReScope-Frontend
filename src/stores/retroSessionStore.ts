import { create } from 'zustand';

import { IRetroSession } from '@/types';

export interface RetroSessionState {
  retroSession: IRetroSession | null;
  setRetroSession: (retroSession: IRetroSession | null) => void;
  clearStorage: () => void;
}

export const useRetroSessionStore = create<RetroSessionState>()((set) => ({
  retroSession: null,
  setRetroSession: (retroSession) => set({ retroSession }),
  clearStorage: () => set({ retroSession: null })
}));

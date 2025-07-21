import { IPollState } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePollStore = create<IPollState>()(
  persist(
    (set) => ({
      poll: null,
      setPoll: (poll) => set({ poll }),
      clearPoll: () => set({ poll: null })
    }),
    {
      name: 'poll-storage'
    }
  )
);

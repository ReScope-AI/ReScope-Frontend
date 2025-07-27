import { IPollState } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Column } from '@/features/kanban/components/board-column';

export interface IPollStoreState extends IPollState {
  // POLLS column management
  pollsColumn:
    | (Column & {
        question: string;
        color: string;
        icon: string;
        disableDragExternal: boolean;
      })
    | null;
  addPollsColumn: (title: string) => void;
  removePollsColumn: () => void;
  getPollsColumn: () =>
    | (Column & {
        question: string;
        color: string;
        icon: string;
        disableDragExternal: boolean;
      })
    | null;
}

export const usePollStore = create<IPollStoreState>()(
  persist(
    (set, get) => ({
      // Original poll state
      poll: null,
      setPoll: (poll) => set({ poll }),
      clearPoll: () => set({ poll: null }),

      // POLLS column management
      pollsColumn: null,
      addPollsColumn: (title: string) =>
        set({
          pollsColumn: {
            id: 'POLLS',
            question: title,
            color: 'gray',
            icon: 'default',
            disableDragExternal: true
          } as Column & {
            question: string;
            color: string;
            icon: string;
            disableDragExternal: boolean;
          }
        }),
      removePollsColumn: () => set({ pollsColumn: null }),
      getPollsColumn: () => get().pollsColumn
    }),
    {
      name: 'poll-storage'
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Column } from '@/features/kanban/components/board-column';
import { IOption, IPollState, IQuestion } from '@/types';

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

  // Poll questions management
  pollQuestions: IQuestion[];
  addPollQuestion: (data: IQuestion) => void;
  removePollQuestion: (id: string) => void;
  updatePollQuestion: (id: string, data: IQuestion) => void;
  setPollQuestions: (questions: IQuestion[]) => void;
  setPollQuestionById: (id: string, data: IQuestion) => void;
  getPollOptionsByPollId: (pollId: string) => IOption[];
  clearPollQuestions: () => void;
  clearStorage: () => void;
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
            icon: 'chart',
            disableDragExternal: true
          } as Column & {
            question: string;
            color: string;
            icon: string;
            disableDragExternal: boolean;
          }
        }),
      removePollsColumn: () => set({ pollsColumn: null }),
      getPollsColumn: () => get().pollsColumn,

      // Poll questions management
      pollQuestions: [],
      addPollQuestion: (data: IQuestion) =>
        set((state) => ({
          pollQuestions: [
            ...state.pollQuestions,
            {
              ...data
            }
          ]
        })),
      removePollQuestion: (id: string) =>
        set((state) => ({
          pollQuestions: state.pollQuestions.filter(
            (question) => question._id !== id
          )
        })),
      updatePollQuestion: (id: string, data: IQuestion) =>
        set((state) => ({
          pollQuestions: state.pollQuestions.map((question) =>
            question._id === id ? { ...question, ...data } : question
          )
        })),
      setPollQuestions: (questions: IQuestion[]) =>
        set({ pollQuestions: questions }),
      setPollQuestionById: (id: string, data: IQuestion) =>
        set((state) => ({
          pollQuestions: state.pollQuestions.map((question) =>
            question._id === id ? { ...question, ...data } : question
          )
        })),
      getPollOptionsByPollId: (pollId: string) =>
        get().pollQuestions.find((question) => question._id === pollId)
          ?.options || [],
      clearPollQuestions: () => set({ pollQuestions: [] }),
      clearStorage: () => {
        set({
          poll: null,
          pollsColumn: null,
          pollQuestions: []
        });
      }
    }),
    {
      name: 'poll-storage'
    }
  )
);

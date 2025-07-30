import { UniqueIdentifier } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Column } from '../components/board-column';

export type Status = 'DROP' | 'ADD' | 'KEEP' | 'IMPROVE' | 'POLL';

export const defaultCols = [
  {
    id: 'DROP' as const,
    title: 'Drop',
    question: 'What practices should we stop or discontinue?',
    color: 'red',
    icon: 'minus'
  },
  {
    id: 'ADD' as const,
    title: 'Add',
    question: 'What new practices should we adopt?',
    color: 'green',
    icon: 'plus'
  },
  {
    id: 'KEEP' as const,
    title: 'Keep',
    question: "What's working well that we should continue?",
    color: 'green',
    icon: 'loop'
  },
  {
    id: 'IMPROVE' as const,
    title: 'Improve',
    question: 'What could we do better?',
    color: 'orange',
    icon: 'gear'
  }
] satisfies (Column & { question: string; color: string; icon: string })[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  votes?: number;
};

export type State = {
  tasks: Task[];
  columns: (Column & { question: string; color: string; icon: string })[];
  draggedTask: string | null;
  openDialog: boolean;
};

const initialTasks: Task[] = [];

export type Actions = {
  addTask: (title: string, description?: string, status?: Status) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (
    cols: (Column & { question: string; color: string; icon: string })[]
  ) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
  setOpenDialog: (open: boolean) => void;
  updateTaskVotes: (taskId: string, increment: boolean) => void;
  clearStorage: () => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      columns: defaultCols,
      draggedTask: null,
      openDialog: false,
      addTask: (title: string, description?: string, status: Status = 'DROP') =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { _id: uuid(), title, description, status, votes: 0 }
          ]
        })),
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col
          )
        })),
      addCol: (title: string) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              title,
              id: title.toUpperCase() as Status,
              question: '',
              color: 'gray',
              icon: 'default'
            }
          ]
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== id)
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id)
        })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (
        newCols: (Column & { question: string; color: string; icon: string })[]
      ) => set({ columns: newCols }),
      setOpenDialog: (open: boolean) => set({ openDialog: open }),
      updateTaskVotes: (taskId: string, increment: boolean) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  votes: Math.max(0, (task.votes || 0) + (increment ? 1 : -1))
                }
              : task
          )
        })),
      clearStorage: () => {
        set({
          tasks: [],
          columns: [],
          draggedTask: null,
          openDialog: false
        });
      }
    }),
    { name: 'task-store' }
  )
);

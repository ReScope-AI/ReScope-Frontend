import { UniqueIdentifier } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

import { ICategory } from '@/types';

import { Column } from '../components/board-column';

export type Status = 'DROP' | 'ADD' | 'KEEP' | 'IMPROVE' | 'POLL';

export type ColumnId = string;

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  votes?: number;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
  openDialog: boolean;
  step: number;
  isGenerating: boolean;
};

export type PlanItemAction = {
  action_type: string;
  description: string;
  rationale: string;
};

const initialTasks: Task[] = [];

export type Actions = {
  addTask: (title: string, description?: string, status?: Status) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (categories: ICategory[]) => void;
  setColumns: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
  setOpenDialog: (open: boolean) => void;
  updateTaskVotes: (taskId: string, increment: boolean) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, '_id'>>) => void;
  updateTasks: (tasksList: Task[]) => void;
  clearStorage: () => void;
  setStep: (step: number) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  resetState: () => void;
};

export const useTaskStore = create<State & Actions>((set) => ({
  tasks: initialTasks,
  columns: [],
  draggedTask: null,
  openDialog: false,
  step: 1,
  isGenerating: false,
  addTask: (title: string, description?: string, status?: Status) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { _id: uuid(), title, description, status: status || 'DROP', votes: 0 }
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
          id: title.toUpperCase()
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
  setCols: (categories) =>
    set({
      columns: categories.map((category) => ({
        id: category._id,
        title: category.name
      }))
    }),
  setColumns: (cols) => set({ columns: cols }),
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
  updateTask: (taskId: string, updates: Partial<Omit<Task, '_id'>>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, ...updates } : task
      )
    })),
  updateTasks: (tasksList: Task[]) =>
    set((state) => {
      const tasksMap = new Map(tasksList.map((task) => [task._id, task]));

      return {
        tasks: state.tasks.map((existingTask) => {
          const updatedTask = tasksMap.get(existingTask._id);
          return updatedTask
            ? { ...existingTask, ...updatedTask }
            : existingTask;
        })
      };
    }),
  clearStorage: () => {
    set({
      tasks: [],
      columns: [],
      draggedTask: null,
      openDialog: false
    });
  },
  setStep: (step: number) => {
    set({ step });
  },
  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
  resetState: () =>
    set({
      tasks: initialTasks,
      columns: [],
      step: 1,
      isGenerating: false,
      draggedTask: null,
      openDialog: false
    })
}));

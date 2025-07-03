import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Question, Sprint, TodoItem } from '@/utils/types/IRetrospective';

interface RetrospectiveState {
  sprints: Sprint[];
  currentSprintId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentSprint: (sprintId: string) => void;
  createSprint: (name: string, startDate: number, endDate: number) => void;
  updateSprint: (sprintId: string, data: Partial<Omit<Sprint, 'id'>>) => void;
  deleteSprint: (sprintId: string) => void;

  // Question actions
  addQuestion: (sprintId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (
    sprintId: string,
    questionId: string,
    data: Partial<Omit<Question, 'id'>>
  ) => void;
  deleteQuestion: (sprintId: string, questionId: string) => void;

  // Answer actions
  addAnswer: (
    sprintId: string,
    questionId: string,
    answer: { text: string; type: 'enhancement' | 'continues' }
  ) => void;
  updateAnswer: (sprintId: string, questionId: string, answerId: string, text: string) => void;
  deleteAnswer: (sprintId: string, questionId: string, answerId: string) => void;

  // Todo actions
  addTodo: (
    sprintId: string,
    type: 'enhancement' | 'continues',
    todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateTodo: (
    sprintId: string,
    type: 'enhancement' | 'continues',
    todoId: string,
    data: Partial<Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  deleteTodo: (sprintId: string, type: 'enhancement' | 'continues', todoId: string) => void;
}

export const useRetrospectiveStore = create<RetrospectiveState>()(
  persist(
    (set) => ({
      sprints: [],
      currentSprintId: null,
      isLoading: false,
      error: null,

      setCurrentSprint: (sprintId) => set({ currentSprintId: sprintId }),

      createSprint: (name, startDate, endDate) => {
        const newSprint: Sprint = {
          id: uuidv4(),
          name,
          startDate,
          endDate,
          questions: [],
          enhancementTodos: [],
          continuesTodos: [],
        };

        set((state) => ({
          sprints: [...state.sprints, newSprint],
          currentSprintId: newSprint.id,
        }));
      },

      updateSprint: (sprintId, data) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId ? { ...sprint, ...data } : sprint
          ),
        }));
      },

      deleteSprint: (sprintId) => {
        set((state) => ({
          sprints: state.sprints.filter((sprint) => sprint.id !== sprintId),
          currentSprintId: state.currentSprintId === sprintId ? null : state.currentSprintId,
        }));
      },

      addQuestion: (sprintId, question) => {
        const newQuestion: Question = {
          id: uuidv4(),
          ...question,
          answers: [],
        };

        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? { ...sprint, questions: [...sprint.questions, newQuestion] }
              : sprint
          ),
        }));
      },

      updateQuestion: (sprintId, questionId, data) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  questions: sprint.questions.map((q) =>
                    q.id === questionId ? { ...q, ...data } : q
                  ),
                }
              : sprint
          ),
        }));
      },

      deleteQuestion: (sprintId, questionId) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  questions: sprint.questions.filter((q) => q.id !== questionId),
                }
              : sprint
          ),
        }));
      },

      addAnswer: (sprintId, questionId, answer) => {
        const newAnswer = {
          id: uuidv4(),
          ...answer,
        };

        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  questions: sprint.questions.map((q) =>
                    q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
                  ),
                }
              : sprint
          ),
        }));
      },

      updateAnswer: (sprintId, questionId, answerId, text) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  questions: sprint.questions.map((q) =>
                    q.id === questionId
                      ? {
                          ...q,
                          answers: q.answers.map((a) => (a.id === answerId ? { ...a, text } : a)),
                        }
                      : q
                  ),
                }
              : sprint
          ),
        }));
      },

      deleteAnswer: (sprintId, questionId, answerId) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  questions: sprint.questions.map((q) =>
                    q.id === questionId
                      ? {
                          ...q,
                          answers: q.answers.filter((a) => a.id !== answerId),
                        }
                      : q
                  ),
                }
              : sprint
          ),
        }));
      },

      addTodo: (sprintId, type, todo) => {
        const newTodo: TodoItem = {
          id: uuidv4(),
          ...todo,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  [type === 'enhancement' ? 'enhancementTodos' : 'continuesTodos']: [
                    ...sprint[type === 'enhancement' ? 'enhancementTodos' : 'continuesTodos'],
                    newTodo,
                  ],
                }
              : sprint
          ),
        }));
      },

      updateTodo: (sprintId, type, todoId, data) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  [type === 'enhancement' ? 'enhancementTodos' : 'continuesTodos']: sprint[
                    type === 'enhancement' ? 'enhancementTodos' : 'continuesTodos'
                  ].map((todo) =>
                    todo.id === todoId ? { ...todo, ...data, updatedAt: Date.now() } : todo
                  ),
                }
              : sprint
          ),
        }));
      },

      deleteTodo: (sprintId, type, todoId) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId
              ? {
                  ...sprint,
                  [type === 'enhancement' ? 'enhancementTodos' : 'continuesTodos']: sprint[
                    type === 'enhancement' ? 'enhancementTodos' : 'continuesTodos'
                  ].filter((todo) => todo.id !== todoId),
                }
              : sprint
          ),
        }));
      },
    }),
    {
      name: 'retrospective-storage',
    }
  )
);

import { create } from 'zustand';
import type { RetroBoard, RetroCard, RetroColumn, User } from '@/utils/types/retrospective';
import { v4 as uuidv4 } from 'uuid';

interface RetrospectiveState {
  board: RetroBoard | null;
  currentUser: User | null;
  connectedUsers: User[];

  // Actions
  setBoard: (board: RetroBoard) => void;
  setCurrentUser: (user: User) => void;
  setConnectedUsers: (users: User[]) => void;
  addCard: (columnId: string, content: string) => void;
  updateCard: (cardId: string, content: string) => void;
  deleteCard: (cardId: string) => void;
  voteCard: (cardId: string, userId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}

const defaultColumns: RetroColumn[] = [
  {
    id: 'drop',
    title: 'Drop',
    description: 'Unproductive practices',
    color: 'bg-red-50 border-red-200',
    cards: [],
  },
  {
    id: 'add',
    title: 'Add',
    description: 'New ideas to implement',
    color: 'bg-green-50 border-green-200',
    cards: [],
  },
  {
    id: 'keep',
    title: 'Keep',
    description: 'Successful current practices',
    color: 'bg-blue-50 border-blue-200',
    cards: [],
  },
  {
    id: 'improve',
    title: 'Improve',
    description: 'Areas for enhancement',
    color: 'bg-orange-50 border-orange-200',
    cards: [],
  },
];

export const useRetrospectiveStore = create<RetrospectiveState>((set, get) => ({
  board: null,
  currentUser: null,
  connectedUsers: [],

  setBoard: (board) => set({ board }),

  setCurrentUser: (user) => set({ currentUser: user }),

  setConnectedUsers: (users) => set({ connectedUsers: users }),

  addCard: (columnId, content) => {
    const { board, currentUser } = get();
    if (!board || !currentUser) return;

    const newCard: RetroCard = {
      id: uuidv4(),
      content,
      author: currentUser.name,
      votes: 0,
      voters: [],
      createdAt: new Date(),
      columnId,
    };

    const updatedBoard = {
      ...board,
      columns: board.columns.map((column) =>
        column.id === columnId ? { ...column, cards: [...column.cards, newCard] } : column
      ),
    };

    set({ board: updatedBoard });
  },

  updateCard: (cardId, content) => {
    const { board } = get();
    if (!board) return;

    const updatedBoard = {
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => (card.id === cardId ? { ...card, content } : card)),
      })),
    };

    set({ board: updatedBoard });
  },

  deleteCard: (cardId) => {
    const { board } = get();
    if (!board) return;

    const updatedBoard = {
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      })),
    };

    set({ board: updatedBoard });
  },

  voteCard: (cardId, userId) => {
    const { board } = get();
    if (!board) return;

    const updatedBoard = {
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => {
          if (card.id === cardId) {
            const hasVoted = card.voters.includes(userId);
            return {
              ...card,
              votes: hasVoted ? card.votes - 1 : card.votes + 1,
              voters: hasVoted
                ? card.voters.filter((id) => id !== userId)
                : [...card.voters, userId],
            };
          }
          return card;
        }),
      })),
    };

    set({ board: updatedBoard });
  },

  moveCard: (cardId, fromColumnId, toColumnId) => {
    const { board } = get();
    if (!board || fromColumnId === toColumnId) return;

    let cardToMove: RetroCard | null = null;

    const updatedBoard = {
      ...board,
      columns: board.columns.map((column) => {
        if (column.id === fromColumnId) {
          const card = column.cards.find((c) => c.id === cardId);
          if (card) {
            cardToMove = { ...card, columnId: toColumnId };
            return {
              ...column,
              cards: column.cards.filter((c) => c.id !== cardId),
            };
          }
        }
        if (column.id === toColumnId && cardToMove) {
          return {
            ...column,
            cards: [...column.cards, cardToMove],
          };
        }
        return column;
      }),
    };

    set({ board: updatedBoard });
  },
}));

// Initialize default board
export const initializeDefaultBoard = () => {
  const defaultBoard: RetroBoard = {
    id: uuidv4(),
    title: 'Sprint Retrospective',
    columns: defaultColumns,
    participants: [],
    createdAt: new Date(),
  };

  useRetrospectiveStore.getState().setBoard(defaultBoard);
};

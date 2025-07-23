'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  cursor: { x: number; y: number; color: string };
}

interface RealtimeMessage {
  id: string;
  type:
    | 'item-added'
    | 'item-updated'
    | 'item-deleted'
    | 'cursor-moved'
    | 'comment-added';
  data: any;
  timestamp: Date;
}

interface RealtimeStore {
  participants: Participant[];
  messages: RealtimeMessage[];
  isConnected: boolean;
  isOnline: boolean;
  isTyping: boolean;
  cursor: { x: number; y: number; color: string };

  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  addMessage: (message: Omit<RealtimeMessage, 'id' | 'timestamp'>) => void;
  setConnectionStatus: (connected: boolean) => void;
  setTypingStatus: (typing: boolean) => void;
  updateCursor: (cursor: { x: number; y: number }) => void;
  clearMessages: () => void;
}

const generateRandomColor = () => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FECA57',
    '#FF9FF3',
    '#54A0FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useRealtimeStore = create<RealtimeStore>()(
  devtools(
    (set, get) => ({
      participants: [],
      messages: [],
      isConnected: false,
      isOnline: true,
      isTyping: false,
      cursor: { x: 0, y: 0, color: generateRandomColor() },

      addParticipant: (participant) =>
        set((state) => ({
          participants: [
            ...state.participants,
            {
              ...participant,
              cursor: { x: 0, y: 0, color: generateRandomColor() }
            }
          ]
        })),

      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id)
        })),

      updateParticipant: (id, updates) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          )
        })),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, id: Date.now().toString(), timestamp: new Date() }
          ]
        })),

      setConnectionStatus: (connected) => set({ isConnected: connected }),

      setTypingStatus: (typing) => set({ isTyping: typing }),

      updateCursor: (cursor) =>
        set((state) => ({
          cursor: { ...cursor, color: state.cursor.color }
        })),

      clearMessages: () => set({ messages: [] })
    }),
    { name: 'retro-realtime-store' }
  )
);

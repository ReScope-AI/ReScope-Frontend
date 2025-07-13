import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useRetrospectiveStore } from '../stores/retrospective-store';
import type { User } from '@/utils/types/retrospective';

export const useSocket = (boardId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { setConnectedUsers, addCard, updateCard, deleteCard, voteCard, moveCard } =
    useRetrospectiveStore();

  useEffect(() => {
    // For demo purposes, we'll simulate socket events
    // In a real app, you'd connect to your Socket.io server
    const mockSocket = {
      emit: (event: string, data: any) => {
        console.log('Socket emit:', event, data);
      },
      on: (event: string, callback: Function) => {
        console.log('Socket listening to:', event);
      },
      disconnect: () => {
        console.log('Socket disconnected');
      },
    };

    socketRef.current = mockSocket as any;

    // Simulate some connected users
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        avatar:
          'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      },
      {
        id: '2',
        name: 'Bob Smith',
        avatar:
          'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      },
      {
        id: '3',
        name: 'Carol Davis',
        avatar:
          'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      },
    ];

    setTimeout(() => {
      setConnectedUsers(mockUsers);
    }, 1000);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [boardId]);

  const emitAddCard = (columnId: string, content: string) => {
    if (socketRef.current) {
      socketRef.current.emit('add-card', { columnId, content });
    }
  };

  const emitUpdateCard = (cardId: string, content: string) => {
    if (socketRef.current) {
      socketRef.current.emit('update-card', { cardId, content });
    }
  };

  const emitDeleteCard = (cardId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('delete-card', { cardId });
    }
  };

  const emitVoteCard = (cardId: string, userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('vote-card', { cardId, userId });
    }
  };

  const emitMoveCard = (cardId: string, fromColumnId: string, toColumnId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('move-card', { cardId, fromColumnId, toColumnId });
    }
  };

  return {
    emitAddCard,
    emitUpdateCard,
    emitDeleteCard,
    emitVoteCard,
    emitMoveCard,
  };
};

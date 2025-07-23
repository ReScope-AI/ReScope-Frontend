import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTaskStore } from '@/features/kanban/utils/store';
import type { Task } from '@/features/kanban/utils/store';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface SocketEvents {
  // Server events
  'user-joined': (user: User) => void;
  'user-left': (userId: string) => void;
  'connected-users': (users: User[]) => void;
  'task-added': (task: Task) => void;
  'task-updated': (task: Task) => void;
  'task-deleted': (taskId: string) => void;
  'task-moved': (data: { taskId: string; newStatus: string }) => void;
  'task-voted': (data: { taskId: string; votes: number }) => void;

  // Client events
  'join-board': (boardId: string) => void;
  'add-task': (task: Omit<Task, 'id'>) => void;
  'update-task': (data: {
    taskId: string;
    title: string;
    description?: string;
  }) => void;
  'delete-task': (taskId: string) => void;
  'move-task': (data: { taskId: string; newStatus: string }) => void;
  'vote-task': (data: { taskId: string; increment: boolean }) => void;
}

export const useSocket = (boardId: string) => {
  const socketRef = useRef<Socket<SocketEvents, SocketEvents> | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const {
    addTask: addTaskToStore,
    setTasks,
    updateTaskVotes,
    removeTask,
    setTasks: setTasksInStore
  } = useTaskStore();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      {
        transports: ['websocket'],
        upgrade: true,
        rememberUpgrade: true
      }
    );

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Connected to socket server');
      setIsConnected(true);

      // Join the specific board
      socket.emit('join-board', boardId);
    });

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // User presence events
    socket.on('user-joined', (user: User) => {
      setConnectedUsers((prev) => [
        ...prev.filter((u) => u.id !== user.id),
        user
      ]);
    });

    socket.on('user-left', (userId: string) => {
      setConnectedUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    socket.on('connected-users', (users: User[]) => {
      setConnectedUsers(users);
    });

    // Task events
    socket.on('task-added', (task: Task) => {
      addTaskToStore(task.title, task.description, task.status);
    });

    socket.on('task-updated', (task: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? task : t))
      );
    });

    socket.on('task-deleted', (taskId: string) => {
      removeTask(taskId);
    });

    socket.on('task-moved', (data: { taskId: string; newStatus: string }) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === data.taskId ? { ...t, status: data.newStatus as any } : t
        )
      );
    });

    socket.on('task-voted', (data: { taskId: string; votes: number }) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === data.taskId ? { ...t, votes: data.votes } : t
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [boardId, addTaskToStore, removeTask, setTasks]);

  // Socket action functions
  const emitAddTask = (
    title: string,
    description?: string,
    status?: string
  ) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('add-task', {
        title,
        description,
        status: status || 'DROP',
        votes: 0
      });
    }
  };

  const emitUpdateTask = (
    taskId: string,
    title: string,
    description?: string
  ) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('update-task', { taskId, title, description });
    }
  };

  const emitDeleteTask = (taskId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('delete-task', taskId);
    }
  };

  const emitMoveTask = (taskId: string, newStatus: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('move-task', { taskId, newStatus });
    }
  };

  const emitVoteTask = (taskId: string, increment: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('vote-task', { taskId, increment });
    }
  };

  return {
    connectedUsers,
    isConnected,
    emitAddTask,
    emitUpdateTask,
    emitDeleteTask,
    emitMoveTask,
    emitVoteTask
  };
};

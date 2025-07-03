import { io, Socket } from 'socket.io-client';
import { auth } from '@/utils/config/firebase';

let socket: Socket | null = null;

export const initializeSocket = async (): Promise<Socket> => {
  if (socket) {
    return socket;
  }

  // Get the current user's token
  const user = auth.currentUser;
  let token = '';

  if (user) {
    token = await user.getIdToken();
  }

  // Connect to the socket server with the token for authentication
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token,
    },
  });

  // Setup event listeners
  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Example of socket events for retrospective
export const joinRetrospectiveRoom = (sprintId: string): void => {
  if (socket) {
    socket.emit('join_room', { roomId: `sprint_${sprintId}` });
  }
};

export const leaveRetrospectiveRoom = (sprintId: string): void => {
  if (socket) {
    socket.emit('leave_room', { roomId: `sprint_${sprintId}` });
  }
};

export const listenToRetrospectiveChanges = (
  sprintId: string,
  callback: (data: unknown) => void
): void => {
  if (socket) {
    socket.on(`sprint_${sprintId}_update`, callback);
  }
};

export const stopListeningToRetrospectiveChanges = (sprintId: string): void => {
  if (socket) {
    socket.off(`sprint_${sprintId}_update`);
  }
};

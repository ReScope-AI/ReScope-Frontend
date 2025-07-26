import { BASE_API as SOCKET_URL } from '@/config/proxy';
import { isDev } from '@/lib/env';
import { connect, disconnect, isConnected } from '@/lib/retro-socket';
import { useAuthStore } from '@/stores/authStore';
import { useCallback, useEffect, useState } from 'react';

interface UseRetroSocketProps {
  retroID: string;
}

export const useRetroSocket = ({ retroID }: UseRetroSocketProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const initializeSocket = useCallback(() => {
    if (!SOCKET_URL || !accessToken || isConnected()) {
      return;
    }

    try {
      connect(SOCKET_URL, { accessToken });
      setConnectionError(null);
    } catch (error) {
      setConnectionError(
        error instanceof Error ? error.message : 'Failed to connect to socket'
      );
    }
  }, [accessToken]);

  const cleanup = useCallback(() => {
    if (isConnected()) {
      disconnect();
    }
  }, []);

  useEffect(() => {
    if (retroID && SOCKET_URL && accessToken) {
      initializeSocket();
    }

    return cleanup;
  }, [initializeSocket, cleanup, retroID, accessToken]);

  return {
    connectionError,
    isDev
  };
};

/* import { useEffect, useRef, useCallback } from 'react';
import { SocketService } from '@/lib/socket-service';
import { BASE_API } from '@/config/proxy';

interface UseRetroSocketOptions {
  retroId: string;
  enabled?: boolean;
}

interface UseRetroSocketReturn {
  socketService: SocketService | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  emitCreateAction: (data: { room: string; event: string; data: any }) => void;
}

export function useRetroSocket({
  retroId,
  enabled = true
}: UseRetroSocketOptions): UseRetroSocketReturn {
  const socketServiceRef = useRef<SocketService | null>(null);

  const getAccessToken = useCallback(() => {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed?.state?.accessToken || '';
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return '';
  }, []);

  const initializeSocket = useCallback(() => {
    if (!BASE_API || !enabled || socketServiceRef.current?.isConnected()) {
      return;
    }

    const socketService = new SocketService(BASE_API);
    const accessToken = getAccessToken();

    socketService.connect({ accessToken });
    socketServiceRef.current = socketService;

    // Auto-join the retrospective room
    if (retroId) {
      socketService.joinRoom(`retro-${retroId}`);
    }
  }, [BASE_API, enabled, retroId, getAccessToken]);

  const cleanup = useCallback(() => {
    if (socketServiceRef.current) {
      if (retroId) {
        socketServiceRef.current.leaveRoom(`retro-${retroId}`);
      }
      socketServiceRef.current.disconnect();
      socketServiceRef.current = null;
    }
  }, [retroId]);

  useEffect(() => {
    if (enabled && retroId) {
      initializeSocket();
    }

    return cleanup;
  }, [enabled, retroId, initializeSocket, cleanup]);

  const joinRoom = useCallback((room: string) => {
    socketServiceRef.current?.joinRoom(room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketServiceRef.current?.leaveRoom(room);
  }, []);

  const emitCreateAction = useCallback(
    (data: { room: string; event: string; data: any }) => {
      socketServiceRef.current?.emit('create-action', data);
    },
    []
  );

  return {
    socketService: socketServiceRef.current,
    isConnected: socketServiceRef.current?.isConnected() || false,
    joinRoom,
    leaveRoom,
    emitCreateAction
  };
} */

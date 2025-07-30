import { BASE_API as SOCKET_URL } from '@/config/proxy';
import { isDev } from '@/lib/env';
import {
  connect,
  disconnect,
  emitJoinRoom,
  isConnected
} from '@/lib/retro-socket';
import { useAuthStore } from '@/stores/authStore';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { useCallback, useEffect, useState } from 'react';

export const useRetroSocket = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const session = useRetroSessionStore((state) => state.retroSession);
  const retroId = session?._id;

  const initializeSocket = useCallback(() => {
    if (!SOCKET_URL || !accessToken || isConnected()) {
      return;
    }

    try {
      connect(
        SOCKET_URL,
        { accessToken },
        {
          onConnect: () => {
            if (!retroId) {
              return;
            }
            emitJoinRoom({ sessionId: retroId });
          }
        }
      );
      setConnectionError(null);
    } catch (error) {
      setConnectionError(
        error instanceof Error ? error.message : 'Failed to connect to socket'
      );
    }
  }, [accessToken, retroId]);

  const cleanup = useCallback(() => {
    if (isConnected()) {
      disconnect();
    }
  }, []);

  useEffect(() => {
    if (retroId && SOCKET_URL && accessToken) {
      initializeSocket();
    }

    return cleanup;
  }, [initializeSocket, cleanup, retroId, accessToken]);

  return {
    connectionError,
    isDev
  };
};
